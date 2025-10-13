import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/config/multer.config';

@Controller('vehicle')
@UseGuards(AuthTokenGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.vehicleService.create(createVehicleDto, tokenPayloadDto.id, files);
  }

  
  @Get()
  findAll(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.findAllVehiclesByUser(tokenPayloadDto.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.vehicleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
