import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';

@Controller('conductor')
export class ConductorController {
  constructor(private readonly conductorService: ConductorService) { }

  // @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  // @Post()
  // create(@Body() createConductorDto: CreateConductorDto) {
  //   return this.conductorService.create(createConductorDto);
  // }


  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get('/vehicle/:id')
  findAllByVehicle(@Param('id') id: number) {
    return this.conductorService.findAllByVehicle(id);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get()
  findAll() {
    return this.conductorService.findAll();
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conductorService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConductorDto: UpdateConductorDto) {
    return this.conductorService.update(+id, updateConductorDto);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conductorService.remove(+id);
  }
}
