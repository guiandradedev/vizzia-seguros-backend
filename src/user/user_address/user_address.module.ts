import { Module } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user_address.entity';
import { AddressModule } from 'src/address/address.module';
import { UsersModule } from 'src/user/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddress]),
    AddressModule,
    // UsersModule
  ],
  controllers: [UserAddressController],
  providers: [UserAddressService],
  exports: [UserAddressService]
})
export class UserAddressModule {}
