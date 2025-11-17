import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';
import { EvaluateInsuranceDto } from './dto/evaluate_insurance.dto';

@Controller('insurance')
@UseGuards(AuthTokenGuard, RoutePolicyGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) { }
  
  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get('pending')
  find_all_pending() {

    return this.insuranceService.findAllPending();
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get()
  find_all_by_user(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.insuranceService.findAll_by_user(tokenPayloadDto.sub);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insuranceService.findOne(+id);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsuranceDto: UpdateInsuranceDto) {
    return this.insuranceService.update(+id, updateInsuranceDto);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insuranceService.remove(+id);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Post('evaluate')
  evaluate_insurance(
    @Body() evaluateInsuranceDto: EvaluateInsuranceDto,
  ) {
    return this.insuranceService.evaluate_insurance(evaluateInsuranceDto);
  }


}
