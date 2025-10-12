import { PartialType } from '@nestjs/mapped-types';
import { CreateCnhImageDto } from './create-cnh-image.dto';

export class UpdateCnhImageDto extends PartialType(CreateCnhImageDto) {}
