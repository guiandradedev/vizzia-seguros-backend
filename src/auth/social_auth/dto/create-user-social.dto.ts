import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateSocialUserDto extends CreateUserDto {
    @IsString()
    @IsNotEmpty()
    provider: string;

    @IsString()
    @IsNotEmpty()
    id_provider: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    provider_email: string;

    @IsOptional()
    @IsString()
    override passwordHash: string = "";
}