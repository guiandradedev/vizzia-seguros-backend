import { IsOptional, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

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
}

