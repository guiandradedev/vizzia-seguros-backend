import { IsString, IsDateString, IsBoolean, IsNumberString } from "@nestjs/class-validator";
import { IntersectionType } from "@nestjs/mapped-types";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";
import { IsCpf } from "src/validators/is-cpf.decorator"
import { IsCnh } from "src/validators/is-cnh.decorator"
import { Transform } from "class-transformer";
import { GenderTypes } from "../enums/gender-type.enum";
import { MaritalStatusType } from "../enums/marital_status-Type.enum";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    passwordHash: string;

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

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

    @IsEnum(GenderTypes)
    gender: GenderTypes;

    @IsEnum(MaritalStatusType)
    marital_status: MaritalStatusType;

    @IsNumber()
    age: number;

}

export class CreateUserDto extends IntersectionType(UserDto, CreateAddressDto, CreateTelephoneDto) { }
