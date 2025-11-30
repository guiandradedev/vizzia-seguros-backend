import { IsString, IsDateString, IsBoolean, IsNumberString } from "@nestjs/class-validator";
import { IntersectionType } from "@nestjs/mapped-types";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsCpf } from "src/validators/is-cpf.decorator"
import { IsCnh } from "src/validators/is-cnh.decorator"
import { Transform } from "class-transformer";
import { MaritalStatusType } from "../enums/marital_status-Type.enum";
import { UpdateTelephoneDto } from "src/telephone/dto/update-telephone.dto";
import { UpdateAddressDto } from "src/address/dto/update-address.dto";

export class PartialUpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @Transform(({ value }) => value.replace(/\D/g, ''))
    @IsCpf({ message: 'Informe um CPF válido' })
    cpf: string;

    @IsOptional()
    @Transform(({ value }) => value.replace(/\D/g, ''))
    @IsCnh({ message: 'CNH inválida!' })
    cnhNumber: string;

    @IsOptional()
    @IsDateString()
    birthDate: string;

    @IsOptional()
    @IsDateString()
    cnhIssueDate: Date;

    @IsEnum(MaritalStatusType)
    @IsOptional()
    marital_status: MaritalStatusType;

    @IsString()
    @IsOptional()
    passwordHash: string;


}

export class UpdateUserDto extends IntersectionType(PartialUpdateUserDto, UpdateTelephoneDto, UpdateAddressDto) { }
