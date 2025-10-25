import { Injectable } from '@nestjs/common';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { VehicleConductor } from './entities/vehicle-conductor.entity';

@Injectable()
export class ConductorService {
  constructor(
    @InjectRepository(Conductor)
    private readonly conductorRepository: Repository<Conductor>,

    @InjectRepository(VehicleConductor)
    private readonly vehicleConductorRepository: Repository<VehicleConductor>,
  ) {}

  async create(createConductorDto: CreateConductorDto, id_vehicle: number) {
    const conductor = this.conductorRepository.create(createConductorDto);

    await this.conductorRepository.insert(conductor);

    await this.vehicleConductorRepository.insert({
      id_vehicle: id_vehicle,
      id_conductor: conductor.id,
    });

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

    return vehicleConductors.map(vc => vc.conductorId);
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
