import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/files/multer/config/multer.config';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';

@Controller('vehicle')
@UseGuards(AuthTokenGuard, RoutePolicyGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.vehicleService.create(createVehicleDto, tokenPayloadDto.id, files);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Get()
  findAll(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.findAllVehiclesByUser(tokenPayloadDto.id);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.vehicleService.findOne(+id);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(+id, updateVehicleDto);
  }

  @SetRoutePolicy([RoutePolicies.admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
