import { Injectable } from '@nestjs/common';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { VehicleConductor } from './entities/vehicle-conductor.entity';
import { ConductorsTelephoneService } from '../conductors_telephone/conductors_telephone.service';
import { CreateConductorsTelephoneDto } from '../conductors_telephone/dto/create-conductors_telephone.dto';

@Injectable()
export class ConductorService {
  constructor(
    @InjectRepository(Conductor)
    private readonly conductorRepository: Repository<Conductor>,

    @InjectRepository(VehicleConductor)
    private readonly vehicleConductorRepository: Repository<VehicleConductor>,

    private readonly conductorTelephoneService: ConductorsTelephoneService,
  ) {}

  async create(createConductorDto: CreateConductorDto, id_vehicle: number) {
    const conductor = this.conductorRepository.create(createConductorDto);

    await this.conductorRepository.insert(conductor);

    await this.vehicleConductorRepository.insert({
      id_vehicle: id_vehicle,
      id_conductor: conductor.id,
    });

    const conductorTelephone: CreateConductorsTelephoneDto = {
      conductorId: conductor,
      telephone: {
        phone_number: createConductorDto.phone_number,
        type: createConductorDto.type,
      },
    };

    await this.conductorTelephoneService.create(conductorTelephone);

    return conductor;
  }

  findAll() {
    return this.conductorRepository.find();
  }

  async findAllByVehicle(id_vehicle: number) {
    const vehicleConductors = await this.vehicleConductorRepository.find({
      where: { id_vehicle },
      relations: ['conductorId'],
    });

    const conductors = vehicleConductors.map(vc => vc.conductorId);

    const conductorsWithTelephones = await Promise.all(
      conductors.map(async conductor => {
        const telephone = await this.conductorTelephoneService.findConductorTelephone(conductor.id);
        return { ...conductor, telephone };
      }),
    );

    return conductorsWithTelephones;
  }

  findOne(id: number) {
    return `This action returns a #${id} conductor`;
  }

  update(id: number, updateConductorDto: UpdateConductorDto) {
    return `This action updates a #${id} conductor`;
  }

  remove(id: number) {
    return `This action removes a #${id} conductor`;
  }
}
