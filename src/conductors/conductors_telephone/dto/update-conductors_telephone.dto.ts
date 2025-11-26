import { PartialType } from '@nestjs/mapped-types';
import { CreateConductorsTelephoneDto } from './create-conductors_telephone.dto';

export class UpdateConductorsTelephoneDto extends PartialType(CreateConductorsTelephoneDto) {}
