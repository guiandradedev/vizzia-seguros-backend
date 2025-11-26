import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { InsuranceEndorsementService } from './insurance-endorsement.service';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';
import { AddConductorsDto } from './dto/add-conductors.dto';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';
import { EvaluateEndorsementDto } from './dto/evaluate-endorsement.dto';

@Controller('insurance-endorsement')
@UseGuards(AuthTokenGuard, RoutePolicyGuard)
export class InsuranceEndorsementController {
  constructor(private readonly insuranceEndorsementService: InsuranceEndorsementService) {}
  
  
  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Post('add-conductors')
  request_add_conductors(
    @Body() addConductorsDto: AddConductorsDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.insuranceEndorsementService.request_add_conductors(addConductorsDto.conductors, addConductorsDto.id_insurance, tokenPayloadDto.sub);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get('all-pending')
  find_all_pending() {
    return this.insuranceEndorsementService.find_all_pending();
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get('pending')
  find_all_pending_by_user(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.insuranceEndorsementService.find_all_pending_by_user(tokenPayloadDto.sub);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Post('evaluate')
  evaluate_endorsement(
    @Body() evaluateEndorsementDto: EvaluateEndorsementDto
  ) {
    return this.insuranceEndorsementService.evaluate_endorsement(evaluateEndorsementDto.id_endosement, evaluateEndorsementDto.approve);
  }
}
