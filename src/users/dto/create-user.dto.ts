import { IsString, IsDateString, IsBoolean, IsNumberString } from "@nestjs/class-validator";
import { IntersectionType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreateTelephoneDto } from "src/telephone/dto/create-telephone.dto";
import { IsCpf } from "src/validators/is-cpf.decorator"
import { IsCnh } from "src/validators/is-cnh.decorator"
import { Transform } from "class-transformer";

class UserDto {
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
    // @IsCpf({ message: 'Informe um CPF válido' })
    cpf: string;

    @IsNotEmpty()
    @Transform(({ value }) => value.replace(/\D/g, ''))
    // @IsCnh({ message: 'CNH inválida!' })
    cnhNumber: string;

    @IsNotEmpty()
    @IsDateString()
    birthDate: string;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

    @IsNotEmpty()
    @IsDateString()
    cnhIssueDate: Date;

}

export class CreateUserDto extends IntersectionType(UserDto, CreateAddressDto, CreateTelephoneDto) {}
