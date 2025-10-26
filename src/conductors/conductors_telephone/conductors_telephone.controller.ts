import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConductorsTelephoneService } from './conductors_telephone.service';
import { CreateConductorsTelephoneDto } from './dto/create-conductors_telephone.dto';
import { UpdateConductorsTelephoneDto } from './dto/update-conductors_telephone.dto';

@Controller('conductors-telephone')
export class ConductorsTelephoneController {
  constructor(private readonly conductorsTelephoneService: ConductorsTelephoneService) {}

  @Post()
  create(@Body() createConductorsTelephoneDto: CreateConductorsTelephoneDto) {
    return this.conductorsTelephoneService.create(createConductorsTelephoneDto);
  }

  @Get()
  findAll() {
    return this.conductorsTelephoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conductorsTelephoneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConductorsTelephoneDto: UpdateConductorsTelephoneDto) {
    return this.conductorsTelephoneService.update(+id, updateConductorsTelephoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conductorsTelephoneService.remove(+id);
  }
}
