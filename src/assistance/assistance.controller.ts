import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { ApproveAssistanceDto, CreateAssistanceDto } from './dto/create-assistance.dto';
import { AuthTokenGuard } from 'src/auth/auth_jwt/guards/auth-token.guard';
import { RoutePolicyGuard } from 'src/roles/guard/route-policy.guard';
import { SetRoutePolicy } from 'src/roles/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/roles/enum/route-policy.enum';
import { TokenPayloadDto } from 'src/auth/auth_jwt/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/auth_jwt/params/token-payload.param';

@UseGuards(AuthTokenGuard, RoutePolicyGuard)
@Controller('assistance')
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) { }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Post('request')
  request_assistance(
    @Body() createAssistanceDto: CreateAssistanceDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.assistanceService.request_assistance(tokenPayloadDto.sub, createAssistanceDto);
  }

  @Get('all-pending')
  get_pending_assistances() {
    return this.assistanceService.get_pending_assistances();
  }

  @Get('all-completed')
  get_completed_assistances() {
    return this.assistanceService.get_completed_assistances();
  }

  @Get('all-progess')
  get_progess_assistances() {
    return this.assistanceService.get_inProgess_assistances();
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get('history')
  get_history(
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto
  ) {
    const userId = Number(tokenPayloadDto.sub);
    if (Number.isNaN(userId)) {
      throw new BadRequestException('Invalid user id in token');
    }

    return this.assistanceService.get_history(userId);
  }

  @Get('terminate/:id')
  terminate_assistance(
    @Param('id') id: number,
  ) {
    return this.assistanceService.terminate_assistance(id);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assistanceService.findOne(id);
  }

  @SetRoutePolicy([RoutePolicies.admin, RoutePolicies.user])
  @Post('approve')
  approve_assistance(
    @Body() approvedAssistance: ApproveAssistanceDto
  ) {
    return this.assistanceService.approve_assistance(approvedAssistance.id_assistance, approvedAssistance.approve);
  }
}
