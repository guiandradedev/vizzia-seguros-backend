import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './create-faq.dto';
import { IsOptional, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
    @IsString()
    @IsOptional()
    @MaxLength(255, {message: 'Mensagem não pode ter mais que 150 caracteres'})
    @MinLength(20, {message: 'A menssagem não pode ter menos que 20 caracteres'})
    question?:string;

    @IsString()
    @IsOptional()
    @MinLength(20, {message: 'A menssagem não pode ter menos que 20 caracteres'})
    answer?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}


