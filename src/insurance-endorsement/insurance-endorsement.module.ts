import { Module } from '@nestjs/common';
import { InsuranceEndorsementService } from './insurance-endorsement.service';
import { InsuranceEndorsementController } from './insurance-endorsement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceEndorsement } from './entities/insurance-endorsement.entity';
import { ConductorModule } from 'src/conductors/conductor/conductor.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { UsersModule } from 'src/user/users/users.module';
import { InsuranceModule } from 'src/insurance/insurance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsuranceEndorsement]),
    ConductorModule,
    VehicleModule,
    UsersModule,
    InsuranceModule,
    
  ],
  controllers: [InsuranceEndorsementController],
  providers: [InsuranceEndorsementService],
  exports: [InsuranceEndorsementService]
})
export class InsuranceEndorsementModule {}
