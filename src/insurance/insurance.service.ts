import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Insurance } from './entities/insurance.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EvaluateInsuranceDto } from './dto/evaluate_insurance.dto';
import { Status } from './enum/status.enum';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { ConductorStatus } from 'src/conductors/conductor/entities/conductor.entity';

@Injectable()
export class InsuranceService {

  constructor(

    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,

    private readonly conductorsService: ConductorService

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

    const { userId, ...vehicle } = insurance[0].vehicle

    insurance[0].vehicle = vehicle;

    return insurance[0];
  }

  async findOne_entity(id: number) {
    const insurance = await this.insuranceRepository.findOne({
      where: {
        id_insurance: id,
      },
      relations: ['vehicle', 'user'],
    });

    if (!insurance)
      throw new NotFoundException('seguro nao encontrado');

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
      const { userId, ...rest } = ins.vehicle;

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
            vehicle: { id: vehicleId },
        },
        loadEagerRelations: false,
    });

    if (!insurance || insurance.length === 0) {
        throw new NotFoundException('Seguro não encontrado para este veículo');
    }

    return insurance[0];
  }

  async findAllPending() {
    const insurances = await this.insuranceRepository.find({
      where: {
        status: Status.Pending,
      },
      relations: ['vehicle'],
    });

    if (!insurances || !insurances.length) {
      throw new NotFoundException('Nenhum seguro pendente foi encontrado');
    }

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const { userId, ...rest } = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest,
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }

  async findAllPending_by_user(userId: number) {
    const insurances = await this.insuranceRepository.find({
      where: {
        user: {id: userId},
        status: Status.Pending,
      },
      relations: ['vehicle'],
    });

    if (!insurances || !insurances.length) {
      throw new NotFoundException('Nenhum seguro pendente foi encontrado');
    }

    const insurancesWithoutUser: any = [];

    insurances.forEach(ins => {
      const { userId, ...rest } = ins.vehicle;

      const aux = {
        ...ins,
        vehicle: rest,
      };

      insurancesWithoutUser.push(aux);
    });

    return insurancesWithoutUser;
  }


  async evaluate_insurance(evaluateInsuranceDto: EvaluateInsuranceDto) {
    const { id_insurance, status } = evaluateInsuranceDto;

    const insurance = await this.findOne_entity(id_insurance);

    if (!insurance) {
      throw new NotFoundException('Seguro não encontrado');
    }

    if (insurance.status !== Status.Pending) {
      throw new BadRequestException(
        `Este seguro não pode ser avaliado, pois seu status já é "${Status[insurance.status]}"`
      );
    }

    const conductors = await this.conductorsService.findAllByVehicle(insurance.vehicle.id);

    for (const cond of conductors) {
      const {telephone, ...rest} = cond;
      rest.status = ConductorStatus.ACCEPTED;
      this.conductorsService.update_entity(rest);
    }

    insurance.status = status;

    return await this.insuranceRepository.save(insurance);
  }

  async update_entity(insurance: Insurance) {
    return await this.insuranceRepository.update(insurance.id_insurance, insurance);
  }
}
