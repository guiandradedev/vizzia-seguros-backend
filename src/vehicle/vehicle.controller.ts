import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/files/multer/config/multer.config';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';
import { ParseArrayPipe } from '@nestjs/common';
import { CreateConductorDto } from 'src/conductors/conductor/dto/create-conductor.dto';

@Controller('vehicle')
@UseGuards(AuthTokenGuard, RoutePolicyGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Get()
  findAll(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.findAllVehiclesByUser(tokenPayloadDto.sub);
  }

  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.vehicleService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    // return this.vehicleService.update(+id, updateVehicleDto);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Delete()
  remove(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @Body('id') id_vehicle: number,
  ) {
    return this.vehicleService.deleteVehicle(id_vehicle, tokenPayloadDto.sub);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('step/1')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  saveStep1(
    @Body() createVehicleDto: CreateVehicleDto,
    @Body('photoType') photoType: string,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {

    if (!photo) {
      throw new BadRequestException('A foto inicial (campo "photo") é obrigatória na etapa 1.');
    }

    return this.vehicleService.saveStep1_create_vehicle(tokenPayloadDto.sub, createVehicleDto, photo, photoType);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('step/2')
  saveStep2(
    @Body(new ParseArrayPipe({ items: CreateConductorDto }))
    createConductors: CreateConductorDto[],
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.saveStep2_assign_conductors(tokenPayloadDto.sub, createConductors);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('step/3')
  @UseInterceptors(FilesInterceptor('photos', 5, multerConfig))
  saveStep3(
    @Body('photosMeta') photosMeta: string | any[] | undefined,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.vehicleService.saveStep3_photos(tokenPayloadDto.sub, files, photosMeta);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('step/4')
  saveStep4(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.step4_estimate_price(tokenPayloadDto.sub);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Post('finalize')
  finalize(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.finalize(tokenPayloadDto.sub);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.user, RoutePolicies.admin])
  @Get('current-draft')
  get_current_draft(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.vehicleService.getCurrentDraft(tokenPayloadDto.sub);
  }

}
