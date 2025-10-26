import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UsersService } from 'src/user/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleImage } from './entities/vehicle-image.entity';
import { DataSource } from 'typeorm';
import { User } from 'src/user/users/entities/user.entity';
import { MotorizationType } from './enums/motorization-types.enum';
import { MotorizationTypeReverseMap } from './map/motorization-type.map';
import path from 'path';
import { CreateVehicleImageDto } from './dto/create-vehicle-image.dto';
import { AssignConductorsDto } from './dto/assignconductors.dto';
import { Conductor } from 'src/conductors/conductor/entities/conductor.entity';
import { ConductorService } from 'src/conductors/conductor/conductor.service';

@Injectable()
export class VehicleService {
  constructor(
    private readonly usersService: UsersService,
    private readonly conductorService: ConductorService,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,

    private readonly dataSource: DataSource,

  ) { }

  async create(
    createVehicleDto: CreateVehicleDto,
    userId: number,
    photos: Array<Express.Multer.File>, // array de arquivos do multer
    photosMeta: string | any[] | undefined, // metadata: JSON string ou array de objetos { file, type } ou array de tipos
  ) {

    const user = await this.usersService.findUserEntityById(userId);

    const { motorization, ...restDto } = createVehicleDto;

    const motorizationString = MotorizationTypeReverseMap[createVehicleDto.motorization];

    // parsear photosMeta
    const parsedPhotosMeta: any[] = (() => {
      if (!photosMeta) return [];
      if (Array.isArray(photosMeta)) return photosMeta;
      try {
        const parsed = JSON.parse(String(photosMeta));
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
      return [];
    })();

    if (!Array.isArray(photos) || photos.length === 0)
      throw new BadRequestException('At least one photo is required');

    // se metadata for array simples de strings, exige mesma quantidade
    const simpleStringsMeta = parsedPhotosMeta.length > 0 && parsedPhotosMeta.every(m => typeof m === 'string');
    if (simpleStringsMeta && parsedPhotosMeta.length !== photos.length)
      throw new BadRequestException('Number of photo types must match number of photos');

    return this.dataSource.transaction(async (manager) => {

      const vehicleInstance = manager.create(Vehicle, {
        motorization: motorizationString,
        ...restDto,
        userId: user,
      });

      const savedVehicle = await manager.save(vehicleInstance);

      // helper para obter tipo para cada arquivo
      const getTypeForFile = (file: Express.Multer.File, idx: number) => {
        // 1) se meta na mesma posição é string -> usa
        if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'string') return parsedPhotosMeta[idx];

        // 2) se meta na mesma posição é objeto com type -> usa
        if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'object' && parsedPhotosMeta[idx].type) return parsedPhotosMeta[idx].type;

        // 3) buscar por nome do arquivo em objetos meta: campos comuns file, originalname, fileName
        const found = parsedPhotosMeta.find(m =>
          m && typeof m === 'object' && (
            m.file === file.originalname ||
            m.originalname === file.originalname ||
            m.fileName === file.originalname
          )
        );
        if (found && found.type) return found.type;

        // 4) fallback: primeira imagem = 'initial' (ou 'inicial' conforme envio), demais = 'extra'
        return idx === 0 ? 'initial' : 'extra';
      };

      const vehicleImageEntities = photos.map((file, idx) =>
        manager.create(VehicleImage, {
          path: file.path,
          type: getTypeForFile(file, idx),
          vehicle: savedVehicle,
        })
      );

      await manager.save(vehicleImageEntities);

      const foundVehicle = await manager.findOne(Vehicle, {
        where: { id: savedVehicle.id },
        relations: {
          images: false,
        }
      });

      if (!foundVehicle)
        throw new NotFoundException('Vehicle not found after save');

      const { userId, ...vehicle } = foundVehicle;
      return vehicle;
    });
  }

  async addImages(
    id_vehicle: number,
    photos: Array<Express.Multer.File>,
    photosMeta: string | any[] | undefined,
  ) {
    const vehicle = await this.vehicleRepository.findOneBy({ id: id_vehicle });

    if (!vehicle)
      throw new NotFoundException('Vehicle not found');

    // parsear photosMeta: string JSON -> array | já array -> usar | undefined -> []
    const parsedPhotosMeta: any[] = (() => {
      if (!photosMeta) return [];
      if (Array.isArray(photosMeta)) return photosMeta;
      try {
        const parsed = JSON.parse(String(photosMeta));
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) { /* ignore */ }
      return [];
    })();

    if (!Array.isArray(photos) || photos.length === 0)
      throw new BadRequestException('At least one photo is required');

    // se meta for array de strings, admite tamanho 1 (aplica primeiro) ou igual ao número de arquivos
    const simpleStringsMeta = parsedPhotosMeta.length > 0 && parsedPhotosMeta.every(m => typeof m === 'string');
    if (simpleStringsMeta && !(parsedPhotosMeta.length === 1 || parsedPhotosMeta.length === photos.length))
      throw new BadRequestException('Number of image types must match number of photos');

    const getTypeForFile = (file: Express.Multer.File, idx: number) => {
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'string') return parsedPhotosMeta[idx];
      if (parsedPhotosMeta[idx] && typeof parsedPhotosMeta[idx] === 'object' && parsedPhotosMeta[idx].type) return parsedPhotosMeta[idx].type;

      // procurar por correspondência de nome do arquivo
      const found = parsedPhotosMeta.find(m =>
        m && typeof m === 'object' && (
          m.file === file.originalname ||
          m.originalname === file.originalname ||
          m.fileName === file.originalname
        )
      );
      if (found && found.type) return found.type;

      // se meta é array de strings com 1 item, aplicar ao primeiro
      if (simpleStringsMeta && parsedPhotosMeta.length === 1 && idx === 0) return parsedPhotosMeta[0];

      return 'extra';
    };

    const imageEntities = photos.map((file, idx) =>
      this.vehicleImageRepository.create({
        path: file.path,
        type: getTypeForFile(file, idx),
        vehicle: vehicle,
      })
    );

    vehicle.finished = true;
    await this.vehicleRepository.update(vehicle.id, vehicle);

    const saved = await this.vehicleImageRepository.save(imageEntities);
    return saved;
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOneBy({ id });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const images = await this.vehicleImageRepository.find({
      where: { vehicle: { id: vehicle.id } },
      order: { id: 'ASC' },
    });

    const filePaths = images.map(img => ({
      id: img.id,
      path: img.path,
      type: img.type,
      // Include the file itself if needed, assuming you have access to the file storage
      file: img.path // Adjust this line based on how you manage file access
    }));

    const { userId, ...vehicleWithoutUser } = vehicle;
    return { 
      ...vehicleWithoutUser, 
      images: filePaths,
      conductors: await this.conductorService.findAllByVehicle(vehicle.id),
    };
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }

  async assignConductors(assignConductorsDto: AssignConductorsDto, userId: number) {
    const vehicle = await this.vehicleRepository.findOneBy({ id: assignConductorsDto.id_vehicle });

    if (!vehicle)
      throw new NotFoundException('Vehicle not found');
    
    const user = await this.usersService.findUserEntityById(userId);
    
    if (vehicle.userId.id != user.id)
      throw new BadRequestException('You do not have permission to assign conductors to this vehicle');
    
    const createdConductors: Conductor[] = [];

    for (const conductorDto of assignConductorsDto.conductors) {
      const created = await this.conductorService.create(conductorDto, vehicle.id);
      createdConductors.push(created);
    }
    
    return createdConductors;
  }


  async findAllVehiclesByUser(userId: number) {
    const veiculos = await this.vehicleRepository.find({
      where: {
        userId: {
          id: userId
        }
      }
    });

    if (!veiculos || veiculos.length === 0)
      throw new NotFoundException('No vehicles found for this user');

    return veiculos.map(({ userId, ...vehicle }) => vehicle);
  }
}
