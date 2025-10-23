import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';

@UseGuards(RoutePolicyGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SetRoutePolicy([RoutePolicies.admin])
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @UseGuards(AuthTokenGuard)
  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    return this.usersService.update(tokenPayloadParam.id, updateUserDto);
  }

  @SetRoutePolicy([RoutePolicies.admin])
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @UseGuards(AuthTokenGuard)
  @Get('/me')
  me(
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    console.log(tokenPayloadParam);
    return this.usersService.me(tokenPayloadParam.id);
  }
}
