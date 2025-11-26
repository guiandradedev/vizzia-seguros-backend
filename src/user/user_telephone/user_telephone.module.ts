import { Module } from '@nestjs/common';
import { UserTelephoneService } from './user_telephone.service';
import { UserTelephoneController } from './user_telephone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTelephone } from './entities/user_telephone.entity';
import { TelephoneService } from 'src/telephone/telephone.service';
import { TelephoneModule } from 'src/telephone/telephone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTelephone]),
    TelephoneModule
  ],
  controllers: [UserTelephoneController],
  providers: [UserTelephoneService],
  exports: [UserTelephoneService],
})
export class UserTelephoneModule {}
