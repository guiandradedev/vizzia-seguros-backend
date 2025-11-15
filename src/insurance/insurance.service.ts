import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Insurance } from './entities/insurance.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

@Injectable()
export class InsuranceService {

  constructor(

    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,


  ) { }

  async create(createInsuranceDto: CreateInsuranceDto) {
    const insurancePayload = createInsuranceDto;

    const insuranceInstance = this.insuranceRepository.create(insurancePayload);
    await this.insuranceRepository.save(insuranceInstance);

    const { user, vehicle, ...rest } = insuranceInstance;

    return rest;
  }

  findAll() {
    return `This action returns all insurance`;
  }

  async findOne(id: number) {
    let insurance: any = await this.insuranceRepository.find({
      where: {
        id_insurance: id
      },
      relations: ['vehicle']
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

    const {userId, ...vehicle} = insurance[0].vehicle
    
    insurance[0].vehicle = vehicle;

    return insurance;
  }

  update(id: number, updateInsuranceDto: UpdateInsuranceDto) {
    return `This action updates a #${id} insurance`;
  }

  remove(id: number) {
    return `This action removes a #${id} insurance`;
  }


  async findAll_by_user(userId: number) {
    const insurances = await this.insuranceRepository.find({
      where: { 
        user: { id: userId }, 
      },
      relations: ['vehicle'],
    });

    if (!insurances.length)
      throw new NotFoundException('seguro nao encontrado');

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const {userId, ...rest} = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }

  async find_by_vehicle(vehicleId: number) {
    const insurance = await this.insuranceRepository.find({
      where: {
        vehicle: {id: vehicleId},
      },
      loadEagerRelations: false,
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

    return insurance;
  }
}
