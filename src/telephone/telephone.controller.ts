import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TelephoneService } from './telephone.service';
import { CreateTelephoneDto } from './dto/create-telephone.dto';
import { UpdateTelephoneDto } from './dto/update-telephone.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';

@Controller('telephone')
export class TelephoneController {
  constructor(private readonly telephoneService: TelephoneService) {}

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createTelephoneDto: CreateTelephoneDto) {
    return this.telephoneService.create(createTelephoneDto);
  }

  @Get()
  findAll() {
    return this.telephoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telephoneService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTelephoneDto: UpdateTelephoneDto) {
    return this.telephoneService.update(+id, updateTelephoneDto);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telephoneService.remove(+id);
  }
}
