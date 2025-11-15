import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';

@Controller('insurance')
@UseGuards(AuthTokenGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) { }

  @Get()
  findAll(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.insuranceService.findAll_by_user(tokenPayloadDto.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insuranceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsuranceDto: UpdateInsuranceDto) {
    return this.insuranceService.update(+id, updateInsuranceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insuranceService.remove(+id);
  }
}
