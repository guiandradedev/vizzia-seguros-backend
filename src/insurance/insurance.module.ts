import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insurance } from './entities/insurance.entity';
import { ConductorModule } from 'src/conductors/conductor/conductor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insurance]),
    ConductorModule,
  ],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService]
})
export class InsuranceModule {}
