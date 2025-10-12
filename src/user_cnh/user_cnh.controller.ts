import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import { CreateUserCnhDto } from './dto/create-user_cnh.dto';
import { UserCnhService } from './user_cnh.service';

@Controller('user-cnh')
export class UserCnhController {
  constructor(private readonly userCnhService: UserCnhService) {}

  @Post()
  create(@Body() createUserCnhDto: CreateUserCnhDto) {
    return this.userCnhService.create(createUserCnhDto);
  }

  @Get()
  findAll() {
    return this.userCnhService.findAll();
  }

  @Get(':id')
  findUserCnh(@Param('id') id: string) {
    return this.userCnhService.findUserCnh(+id);
  }
}
