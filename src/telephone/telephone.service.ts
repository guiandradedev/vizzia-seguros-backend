import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTelephoneDto } from './dto/create-telephone.dto';
import { UpdateTelephoneDto } from './dto/update-telephone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Telephone } from './entities/telephone.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TelephoneService {
  constructor(
    @InjectRepository(Telephone)
    private readonly telephoneRepository: Repository<Telephone>,
  ) { }

  async create(createTelephoneDto: CreateTelephoneDto) {

    console.log(createTelephoneDto)

    const telephone = this.telephoneRepository.create(createTelephoneDto);

    const telephoneEntity = await this.telephoneRepository.insert(telephone);

    return telephone;
  }

  findAll() {
    return this.telephoneRepository.find();
  }

  async findOne(id: number) {
    const telephone = await this.telephoneRepository.findOneBy({ id });

    if (telephone)
      return telephone;

    throw new NotFoundException('Telephone not found');
  }
  async update(id: number, updateTelephoneDto: UpdateTelephoneDto) {
    const telephone = await this.findOne(id);

    telephone.phone_number = updateTelephoneDto.phone_number ?? telephone.phone_number;
    telephone.type = updateTelephoneDto.type ?? telephone.type;

    await this.telephoneRepository.update(telephone.id, telephone);

    return telephone;
  }


  async remove(id: number) {
    const telephone = await this.findOne(id);

    await this.telephoneRepository.delete(telephone);

    return telephone;
  }
}
