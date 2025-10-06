import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { UseGuards } from '@nestjs/common';
import { ParseIntIdPipe } from 'src/common/pipes/pipe-int-id.pipe';
import { Faq } from './entities/faq.entity';

@Controller('faq')
@UsePipes(ParseIntIdPipe)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  async findAll(@Query('active') active?: string): Promise<Faq[]> {
    // Se active for passado, converte para boolean
    const isActive = active !== undefined ? active === 'true' : undefined;
    return this.faqService.findAll(isActive);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}

