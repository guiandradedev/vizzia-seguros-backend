import { IsNotEmpty, IsDateString, IsEmail, IsString } from "class-validator";
import { IsCnh } from "src/validators/is-cnh.decorator";
import { IsCpf } from "src/validators/is-cpf.decorator";
import { Transform } from "class-transformer";

export class CreateConductorDto {

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
}
