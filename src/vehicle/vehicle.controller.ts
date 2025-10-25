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
import { ParseArrayPipe } from '@nestjs/common';
import { CreateVehicleImageDto } from './dto/create-vehicle-image.dto';
import { AssignConductorsDto } from './dto/assignconductors.dto';

@Controller('vehicle')
@UseGuards(AuthTokenGuard, RoutePolicyGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post()
  @UseInterceptors(FilesInterceptor('photos', 5, multerConfig)) // aceita múltiplas fotos no campo 'photos'
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Body('photos') photosMeta: string | any[] | undefined, // pode ser JSON string ou array de objetos
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.vehicleService.create(createVehicleDto, tokenPayloadDto.id, files, photosMeta);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('images')
  @UseInterceptors(FilesInterceptor('photos', 5, multerConfig)) // arquivos no campo 'photos'
  addImages(
    @Body() body: CreateVehicleImageDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ){
    // body.vehicle_id e body.photos (metadata) são esperados
    return this.vehicleService.addImages(body.vehicle_id, files, body.photos);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('conductors')
  assignConductors(
    @Body() assignConductorsDto: AssignConductorsDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    // console.log(tokenPayloadDto);
    return this.vehicleService.assignConductors(assignConductorsDto, tokenPayloadDto.id);
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
