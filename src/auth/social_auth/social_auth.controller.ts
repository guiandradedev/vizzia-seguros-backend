import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SocialAuthService } from './social_auth.service';
import { SocialAuthLoginDto } from './dto/social_authLogin.dto';
import { AuthTokenGuard } from '../auth_jwt/guards/auth-token.guard';
import { TokenPayloadDto } from '../auth_jwt/dto/token-payload.dto';
import { TokenPayloadParam } from '../auth_jwt/params/token-payload.param';
import { CreateSocialUserDto } from './dto/create-user-social.dto';
import { AllowedTokenTypes } from '../decorators/allowed-token-types.decorator';
import { TokenTypes } from '../enums/tokenTypes.enum';

@Controller('social-auth')
export class SocialAuthController {
    constructor(
        private readonly socialAuthService: SocialAuthService,
    ){}

    @Post('login')
    login(@Body() socialAuthLoginDto: SocialAuthLoginDto){
        return this.socialAuthService.login(socialAuthLoginDto);
    };

    @AllowedTokenTypes(TokenTypes.CREATEUSERSOCIAL)
    @UseGuards(AuthTokenGuard)
    @Post('register')
    createUserAndLink(@Body() createUserSocialDto: CreateSocialUserDto){
        return this.socialAuthService.createUserAndLink(createUserSocialDto)
    };

    @UseGuards(AuthTokenGuard)
    @Post('link')
    validateAndLink(
        @Body() socialAuthLoginDto: SocialAuthLoginDto,
        @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
    ){
        return this.socialAuthService.validateAndLink(socialAuthLoginDto, tokenPayloadParam.id);
    }
}
