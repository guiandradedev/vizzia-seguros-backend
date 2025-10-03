import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository : Repository<Faq>,
  ){}

  create(createFaqDto: CreateFaqDto) : Promise<Faq> {
    const faq = this.faqRepository.create(createFaqDto)
    return this.faqRepository.save(faq);
  }

  findAllActives() : Promise<Faq[]>
  {
    return this.faqRepository.find({where: {isActive:true}, order: {createdAt: 'DESC'} });
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) : Promise<Faq> {
    const faq = await this.faqRepository.preload({id, ...updateFaqDto})
    if(!faq)
    {
      throw new NotFoundException(`Faq com ID "${id}" não encontrado.`)
    }

    return this.faqRepository.save(faq);
  }

  async remove(id: string)  : Promise<void> {
    const faq = await this.faqRepository.delete(id);

    if(!faq){
      throw new NotFoundException('Id de faq não encontrado');
    }

    return this.faqRepository.delete(id);
  }
}
