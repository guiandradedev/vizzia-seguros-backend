import { IsNotEmpty, IsDateString, IsEmail, IsString, IsOptional } from "class-validator";
import { IsCnh } from "src/validators/is-cnh.decorator";
import { IsCpf } from "src/validators/is-cpf.decorator";
import { Transform } from "class-transformer";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";

export class CreateConductorDto extends CreateTelephoneDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @Transform(({ value }) => value.replace(/\D/g, ''))
    @IsCpf({ message: 'Informe um CPF válido' })
    cpf: string;

    @IsNotEmpty()
    @Transform(({ value }) => value.replace(/\D/g, ''))
    @IsCnh({ message: 'CNH inválida!' })
    cnhNumber: string;

    @IsNotEmpty()
    @IsDateString()
    birthDate: string;

    @IsNotEmpty()
    @IsDateString()
    cnhIssueDate: Date;

    @IsNotEmpty()
    @IsDateString()
    cnhExpiryDate: Date;

    @IsString()
    @IsOptional()
    relationship?: string;
}
