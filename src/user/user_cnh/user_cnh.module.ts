import { Module } from '@nestjs/common';
import { UserCnhService } from './user_cnh.service';
import { UserCnhController } from './user_cnh.controller';

@Module({
  controllers: [UserCnhController],
  providers: [UserCnhService],
})
export class UserCnhModule {}
