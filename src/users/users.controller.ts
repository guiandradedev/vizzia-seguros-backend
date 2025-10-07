import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TreeParent } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    return this.usersService.update(tokenPayloadParam.id, updateUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/me')
  me(
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    console.log(tokenPayloadParam);
    return this.usersService.me(tokenPayloadParam.id);
  }
}
