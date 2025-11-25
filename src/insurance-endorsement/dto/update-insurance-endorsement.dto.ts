import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceEndorsementDto } from './create-insurance-endorsement.dto';

export class UpdateInsuranceEndorsementDto extends PartialType(CreateInsuranceEndorsementDto) {}
