import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get()
  findAll() {
    return this.userAddressService.findAll();
  }

  @Get(':id')
  findUserAddress(@Param('id') id: string) {
    return this.userAddressService.findUserAddress(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.userAddressService.updateUserAddress(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(+id);
  }
}
