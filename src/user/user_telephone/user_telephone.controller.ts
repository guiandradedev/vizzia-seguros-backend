import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserTelephoneService } from './user_telephone.service';
import { CreateUserTelephoneDto } from './dto/create-user_telephone.dto';
import { UpdateUserTelephoneDto } from './dto/update-user_telephone.dto';
import { UpdateTelephoneDto } from 'src/telephone/dto/update-telephone.dto';

@Controller('user-telephone')
export class UserTelephoneController {
  constructor(private readonly userTelephoneService: UserTelephoneService) {}

  @Post()
  create(@Body() createUserTelephoneDto: CreateUserTelephoneDto) {
    return this.userTelephoneService.create(createUserTelephoneDto);
  }

  @Get(':id')
  findUserTelephone(@Param('id') id: string) {
    return this.userTelephoneService.findUserTelephone(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTelephoneDto: UpdateTelephoneDto) {
    return this.userTelephoneService.updateUserTelephone(+id, updateTelephoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTelephoneService.removeUserTelephone(+id);
  }
}
