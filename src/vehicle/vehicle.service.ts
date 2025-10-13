import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UsersService } from 'src/user/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleImage } from './entities/vehicle-image.entity';
import { DataSource } from 'typeorm';
import { User } from 'src/user/users/entities/user.entity';

@Injectable()
export class VehicleService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,

    private readonly dataSource: DataSource,

  ) { }

  async create(
    createVehicleDto: CreateVehicleDto,
    userId: number,
    photos: Array<Express.Multer.File>
  ) {

    const user = await this.usersService.findUserEntityById(userId);

    return this.dataSource.transaction(async (manager) => {

      const vehicleInstance = manager.create(Vehicle,{
        ...createVehicleDto,
        userId: user,
      });

      // vehicleInstance.userId = { id: userId } as User;

      const savedVehicle = await manager.save(vehicleInstance);

      const imageSavePromises = photos.map(photo => {
        const imagePayload = {
          path: photo.path, // Salva o caminho do arquivo
          vehicle: savedVehicle, // Vincula a imagem à entidade do veículo
        };
        const vehicleImageEntity = manager.create(VehicleImage, imagePayload);
        return manager.save(vehicleImageEntity);
      });

      await Promise.all(imageSavePromises);

      return manager.findOne(Vehicle, {
        where: { id: savedVehicle.id },
        relations: {
          images: true // Carrega a relação 'images'
        }
      });
    });
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOneBy({
      id: id
    })

    if (!vehicle)
      throw new NotFoundException('Vehicle not found')

    return vehicle;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
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


    return veiculos;
  }
}
