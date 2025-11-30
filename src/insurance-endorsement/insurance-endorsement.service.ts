import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndorsementStatus, EndorsementType, InsuranceEndorsement } from './entities/insurance-endorsement.entity';
import { Repository } from 'typeorm';
import { ConductorService } from 'src/conductors/conductor/conductor.service';
import { UsersService } from 'src/user/users/users.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';
import { InsuranceService } from 'src/insurance/insurance.service';
import { Conductor, ConductorStatus } from 'src/conductors/conductor/entities/conductor.entity';
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
    const user = await this.usersService.findUserEntityById(user_Id);

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

    const endorsements = this.insuranceEndorsementRepository.create({
      type: EndorsementType.ADD_CONDUCTOR,
      status: EndorsementStatus.PENDING,
      value_change: price_increase,
      insurance: insurance,
      target_conductor: conds,
      requested_by: user,
      created_at: new Date(),
    } as InsuranceEndorsement);

    return await this.insuranceEndorsementRepository.save(endorsements);
  }

  async find_all_pending() {
    return await this.insuranceEndorsementRepository.find({
      where: {
        status: EndorsementStatus.PENDING
      },
      relations: ['insurance', 'insurance.user', 'target_conductor']
    });
  }

  async find_all_pending_by_user(userId: number) {
    const endorsements = await this.insuranceEndorsementRepository.find({
      where: {
        requested_by: { id: userId },
        status: EndorsementStatus.PENDING
      },
      relations: ['insurance', 'target_conductor']
    });

    let ends: any[] = [];

    for (const e of endorsements) {
      const { requested_by, ...rest } = e;

      ends.push(rest);
    }

    return ends;
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

        for (const cond of endorsement.target_conductor) {
          cond.status = ConductorStatus.ACCEPTED;
          await this.conductorsService.update_entity(cond);
        }
      }

    } else {
      endorsement.status = EndorsementStatus.REJECTED;
    }

    endorsement.processed_at = new Date();

    return await this.insuranceEndorsementRepository.save(endorsement);

  }
}
