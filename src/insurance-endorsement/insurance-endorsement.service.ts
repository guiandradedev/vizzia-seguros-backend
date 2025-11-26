import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndorsementStatus, EndorsementType, InsuranceEndorsement } from './entities/insurance-endorsement.entity';
import { Repository } from 'typeorm';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { UsersService } from 'src/user/users/users.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';
import { InsuranceService } from 'src/insurance/insurance.service';
import { Conductor } from 'src/conductors/conductor/entities/conductor.entity';
import { Status } from 'src/insurance/enum/status.enum';

@Injectable()
export class InsuranceEndorsementService {

  constructor(
    @InjectRepository(InsuranceEndorsement)
    private readonly insuranceEndorsementRepository: Repository<InsuranceEndorsement>,

    private readonly conductorsService: ConductorService,
    private readonly usersService: UsersService,
    private readonly vehicleService: VehicleService,
    private readonly insuranceService: InsuranceService,


  ) { }

  async request_add_conductors(createConductorDto: CreateConductorDto[], id_insurance: number, user_Id: number) {
    const insurance = await this.insuranceService.findOne_entity(id_insurance);

    if (insurance.user.id != user_Id) {
      throw new UnauthorizedException();
    }

    if (insurance.status != Status.Approved) {
      throw new NotAcceptableException('Apenas seguros ativos podem solicitar endossos');
    }

    let price_increase: number = 0.0;
    let conds: Conductor[] = [];

    for (const cond of createConductorDto) {
      price_increase += this.vehicleService.calculate_conductors_price(cond);
      const conductor = await this.conductorsService.create(cond, insurance.vehicle.id);
      conds.push(conductor);
    }

    const endorsement = this.insuranceEndorsementRepository.create({
      insurance: insurance,
      conductors: conds,
      price_increase,
      status: EndorsementStatus.PENDING,
      type: EndorsementType.ADD_CONDUCTOR,
      created_at: new Date(),
    } as any);

    return await this.insuranceEndorsementRepository.save(endorsement);
  }

  async find_all_pending() {
    return await this.insuranceEndorsementRepository.find({
      where: {
        status: EndorsementStatus.PENDING
      },
      relations: ['insurance', 'insurance.user', 'target_conductor']
    });
  }

  async find_one(id_endorsement: number) {
    return await this.insuranceEndorsementRepository.findOne({
      where: {
        id: id_endorsement
      },
      relations: ['insurance', 'insurance.user', 'target_conductor']
    });
  }

  async evaluate_endorsement(id_endorsement: number, approve: boolean) {
    const endorsement = await this.insuranceEndorsementRepository.findOne({
      where: {
        id: id_endorsement
      },
      relations: ['insurance', 'target_conductor']
    });

    if (!endorsement) {
      throw new NotAcceptableException('Endosso nao encontrado');
    }

    if (endorsement.status != EndorsementStatus.PENDING) {
      throw new NotAcceptableException('Apenas endossos pendentes podem ser avaliados');
    }

    if (approve) {
      endorsement.status = EndorsementStatus.APPROVED;

      if (endorsement.type == EndorsementType.ADD_CONDUCTOR) {
        const insurance = endorsement.insurance;
        insurance.estimated_price += endorsement.value_change;
        await this.insuranceService.update_entity(insurance);
      }

    } else {
      endorsement.status = EndorsementStatus.REJECTED;
    }

    endorsement.processed_at = new Date();

    return await this.insuranceEndorsementRepository.save(endorsement);

  }
}
