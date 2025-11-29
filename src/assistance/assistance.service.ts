import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { InsuranceService } from 'src/insurance/insurance.service';
import { Status } from 'src/insurance/enum/status.enum';
import { AssistanceCosts, AssistanceStatus } from './enum/assistance-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Assistance } from './entities/assistance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssistanceService {
  constructor(

    private insuranceService: InsuranceService,

    @InjectRepository(Assistance)
    private readonly assistanceRepository: Repository<Assistance>,

  ) { }

  async findOne(id_assistance: number) {
    const assistance = await this.assistanceRepository.findOneBy({ id: id_assistance });

    if (!assistance)
      throw new NotFoundException('Nao existe tal assistencia');

    return assistance;
  }

  async request_assistance(userId: number, createAssistanceDto: CreateAssistanceDto) {
    const insurance = await this.insuranceService.find_by_vehicle(createAssistanceDto.vehicleId);


    if (insurance.status !== Status.Approved) {
      throw new ForbiddenException('o seguro precisa ser aprovado ainda');
    }

    const cost = AssistanceCosts[createAssistanceDto.type];

    const request_assistance = this.assistanceRepository.create({
      type: createAssistanceDto.type,
      description: createAssistanceDto.description,
      location: createAssistanceDto.location,
      status: AssistanceStatus.PENDING,
      cost_value: cost,
      insurance: insurance,
      requested_at: new Date(),
    } as Assistance);

    const saved_assistance = await this.assistanceRepository.save(request_assistance);

    return saved_assistance;
  }

  async get_history(userId: number) {
    console.log(userId);
    return await this.assistanceRepository.find({
      where: {
        insurance: { user: { id: userId } },
      },
      relations: ['insurance', 'insurance.vehicle'],
      order: { requested_at: 'DESC' }
    });
  }

  async approve_assistance(id_assistance: number, approve: boolean) {
    const assistance = await this.findOne(id_assistance);

    if (approve) {
      assistance.status = AssistanceStatus.IN_PROGRESS;

      return this.update_entity(assistance);
    }else {
      assistance.status = AssistanceStatus.CANCELLED;

      return this.update_entity(assistance);
    }
  }

  async terminate_assistance(id_assistance: number) {
    const assistance = await this.findOne(id_assistance);

    assistance.status = AssistanceStatus.COMPLETED;

    return this.update_entity(assistance);
  }

  async get_pending_assistances(): Promise<Assistance[]> {
    return await this.assistanceRepository.find({
      where: { status: AssistanceStatus.PENDING },
      relations: ['insurance', 'insurance.vehicle'],
      order: { requested_at: 'DESC' },
    });
  }

  async update_entity(assistance: Assistance) {
    const updated_entity = await this.assistanceRepository.update(assistance.id, assistance);

    return updated_entity;
  }
}
