import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { UseGuards } from '@nestjs/common';
import { ParseIntIdPipe } from 'src/common/pipes/pipe-int-id.pipe';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@Controller('faq')
@UsePipes(ParseIntIdPipe)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  //@UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  //@UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  //@UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(id, updateFaqDto);
  }

  //@UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}

