import { forwardRef, Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { UsersModule } from 'src/user/users/users.module';
import { VehicleImage } from './entities/vehicle-image.entity';
import { ConductorModule } from 'src/conductors/conductor/conductor.module';
import { CacheModule } from '@nestjs/cache-manager';
import { InsuranceModule } from 'src/insurance/insurance.module';
import { HttpModule } from '@nestjs/axios';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehicleImage]),
    ConductorModule,
    forwardRef(() => UsersModule),
    // CacheModule,
    InsuranceModule,
    HttpModule,
    AddressModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
