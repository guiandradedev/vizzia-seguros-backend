import { Module } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { AssistanceController } from './assistance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistance } from './entities/assistance.entity';
import { UsersModule } from 'src/user/users/users.module';
import { InsuranceModule } from 'src/insurance/insurance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assistance]),
    UsersModule,
    InsuranceModule,
  ],
  controllers: [AssistanceController],
  providers: [AssistanceService],
  exports: [AssistanceService]
})
export class AssistanceModule {}
