import { Module } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { ConductorController } from './conductor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conductor } from './entities/conductor.entity';
import { VehicleConductor } from './entities/vehicle-conductor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conductor, VehicleConductor]),
    ConductorModule,
    
  ],
  controllers: [ConductorController],
  providers: [ConductorService],
  exports: [ConductorService],
})
export class ConductorModule {}
