import { IsString } from "@nestjs/class-validator";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {

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
}
