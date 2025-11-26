import { IsOptional, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength, IsEnum } from '@nestjs/class-validator';
import { Category } from '../entities/faq.entity';

export class CreateFaqDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255, {message: 'Mensagem não pode ter mais que 150 caracteres'})
    @MinLength(20, {message: 'A menssagem não pode ter menos que 20 caracteres'})
    question:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(20, {message: 'A menssagem não pode ter menos que 20 caracteres'})
    answer: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(Category, {message: `A categoria deve ser uma das seguintes: ${Object.values(Category).join(', ')}`,})
    category: Category
}

