import { Body, Controller, Post } from '@nestjs/common';
import { SocialAuthService } from './social_auth.service';
import { SocialAuthLoginDto } from './dto/social_authLogin.dto';

@Controller('social-auth')
export class SocialAuthController {
    constructor(
        private readonly socialAuthService: SocialAuthService,
    ){}

    @Post('login')
    login(@Body() socialAuthLoginDto: SocialAuthLoginDto){
        return this.socialAuthService.login(socialAuthLoginDto);
    };

    @Post('register')
    createUserAndLink(@Body() socialAuthLoginDto: SocialAuthLoginDto){
        // Registration logic to be implemented
    };
}
