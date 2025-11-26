import { IsNotEmpty, IsDateString, IsEmail, IsString, IsOptional, IsEnum, IsNumber } from "class-validator";
import { IsCnh } from "src/validators/is-cnh.decorator";
import { IsCpf } from "src/validators/is-cpf.decorator";
import { Transform } from "class-transformer";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";
import { GenderTypes } from "src/user/users/enums/gender-type.enum";
import { MaritalStatusType } from "src/user/users/enums/marital_status-Type.enum";

export class CreateConductorDto extends CreateTelephoneDto {

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

    @IsEnum(GenderTypes)
    gender: GenderTypes;

    @IsEnum(MaritalStatusType)
    marital_status: MaritalStatusType;

    @IsNumber()
    age: number;
}
