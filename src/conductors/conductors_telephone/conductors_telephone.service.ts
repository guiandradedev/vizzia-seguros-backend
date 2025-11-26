import { Injectable } from '@nestjs/common';
import { CreateConductorsTelephoneDto } from './dto/create-conductors_telephone.dto';
import { UpdateConductorsTelephoneDto } from './dto/update-conductors_telephone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConductorsTelephone } from './entities/conductors_telephone.entity';
import { Repository } from 'typeorm';
import { TelephoneService } from 'src/telephone/telephone.service';

@Injectable()
export class ConductorsTelephoneService {
  constructor(
    @InjectRepository(ConductorsTelephone)
    private readonly conductorsTelephoneRepository: Repository<ConductorsTelephone>,
    
    private readonly telephoneService: TelephoneService,
  ) {}

  async create(createConductorsTelephoneDto: CreateConductorsTelephoneDto) {
    const telephone = await this.telephoneService.create(createConductorsTelephoneDto.telephone);

    const conductorsTelephone = this.conductorsTelephoneRepository.create({
      conductorId: createConductorsTelephoneDto.conductorId,
      telephoneId: telephone,
    });

    return this.conductorsTelephoneRepository.save(conductorsTelephone);
  }

  async findConductorTelephone(conductorId: number) {
    const conductorsTelephone = await this.conductorsTelephoneRepository.findOne({
      where: { conductorId: { id: conductorId } },
      relations: ['telephoneId'],
    });
    
    // Retorna apenas o telefone, se existir
    return conductorsTelephone?.telephoneId;
  }

  findAll() {
    return `This action returns all conductorsTelephone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conductorsTelephone`;
  }

  update(id: number, updateConductorsTelephoneDto: UpdateConductorsTelephoneDto) {
    return `This action updates a #${id} conductorsTelephone`;
  }

  remove(id: number) {
    return `This action removes a #${id} conductorsTelephone`;
  }
}
