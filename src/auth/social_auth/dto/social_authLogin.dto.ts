import { IsNotEmpty, IsString } from "class-validator";

export class SocialAuthLoginDto {
    @IsString()
    @IsNotEmpty()
    provider: string;


    @IsString()
    @IsNotEmpty()
    token: string;
}