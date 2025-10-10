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

  async findAll(isActive?: boolean): Promise<Faq[]> {
    if (isActive !== undefined) {
      return this.faqRepository.find({ where: { isActive } });
    }
    return this.faqRepository.find(); // retorna todos se isActive for undefined
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) : Promise<Faq> {
    const faq = await this.faqRepository.findOneBy({id});

    if (faq) {
      faq.question = updateFaqDto?.question ?? faq.question;

      faq.answer = updateFaqDto?.answer ?? faq.answer;

      faq.isActive = updateFaqDto?.isActive ?? faq.isActive;

      faq.category = updateFaqDto?.category ?? faq.category;
      
      await this.faqRepository.save(faq);
      return faq;
    }
  
    throw new NotFoundException(`Faq com ID "${id}" não encontrado.`)
  
  }

  async remove(id: string)  : Promise<void> {
    const faq = await this.faqRepository.delete(id);

    if(!faq){
      throw new NotFoundException('Id de faq não encontrado');
    }
  }
}

