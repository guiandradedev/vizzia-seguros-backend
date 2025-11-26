import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCnhDto } from './create-user_cnh.dto';

export class UpdateUserCnhDto extends PartialType(CreateUserCnhDto) {}
