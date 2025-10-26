import { Module } from '@nestjs/common';
import { ConductorsTelephoneService } from './conductors_telephone.service';
import { ConductorsTelephoneController } from './conductors_telephone.controller';
import { Type } from 'class-transformer';
import { ConductorsTelephone } from './entities/conductors_telephone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelephoneModule } from 'src/telephone/telephone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConductorsTelephone]),
    TelephoneModule,
  ],
  controllers: [ConductorsTelephoneController],
  providers: [ConductorsTelephoneService],
  exports: [ConductorsTelephoneService],
})
export class ConductorsTelephoneModule {}
