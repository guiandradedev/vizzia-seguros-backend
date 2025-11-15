import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insurance } from './entities/insurance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Insurance]),
    
  ],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService]
})
export class InsuranceModule {}
