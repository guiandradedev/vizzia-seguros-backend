import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTelephoneDto } from './create-user_telephone.dto';

export class UpdateUserTelephoneDto extends PartialType(CreateUserTelephoneDto) {}
