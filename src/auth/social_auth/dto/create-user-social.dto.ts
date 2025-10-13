import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "src/user/users/dto/create-user.dto";

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

    @IsNotEmpty()
    @IsString()
    override passwordHash: string = "";
}