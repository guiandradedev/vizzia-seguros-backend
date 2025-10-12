import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserTelephoneModule } from 'src/user_telephone/user_telephone.module';
import { UserAddressModule } from 'src/user_address/user_address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserTelephoneModule,
    UserAddressModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
