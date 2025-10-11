import { BadRequestException, Injectable } from '@nestjs/common';
import { SocialAuthLoginDto } from './dto/social_authLogin.dto';
import { GoogleAuthProvider } from './providers/google_auth/google_auth';
import { Repository } from 'typeorm';
import { UserSocialAuth } from './entities/user_social_auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth_jwt/auth.service';
import { CreateSocialUserDto } from './dto/create-user-social.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SocialAuthService {
    constructor(
        private readonly googleAuthProvider: GoogleAuthProvider,

        @InjectRepository(UserSocialAuth)
        private readonly userSocialAuthRepository: Repository<UserSocialAuth>,

        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }


    async login(socialAuthLoginDto: SocialAuthLoginDto) {
        const userProviderData = await this.googleAuthProvider.validate(socialAuthLoginDto.token);

        if (!userProviderData) throw new BadRequestException('Provider invalido');

        const user = await this.findUserbyProviderId(userProviderData.id_provider, socialAuthLoginDto.provider);

        if (!user) throw new BadRequestException({
            message: 'User not found',
            email: userProviderData.email,
            nome: userProviderData.name,
            createusersocialtoken: await this.authService.createUserSocialToken(
                socialAuthLoginDto.provider,
                userProviderData.id_provider,
                userProviderData.email,
                userProviderData.name,
            ),
        });

        return this.authService.generateToken(user.id);
    }

    private async findUserbyProviderId(providerID: string, provider: string) {
        const userSocialAuth = await this.userSocialAuthRepository.findOne({
            where: {
                id_provider: providerID,
                provider: provider
            },
            relations: {
                userId: true,
            }
        });

        if (!userSocialAuth)
            return null;
        1
        return userSocialAuth.userId;
    }

    async createUserAndLink(createUserSocialDto: CreateSocialUserDto) {
        const userData: CreateUserDto = {
            name: createUserSocialDto.name,
            email: createUserSocialDto.email,
            passwordHash: createUserSocialDto.passwordHash
        };

        const user = await this.usersService.create(userData);

        return await this.linkSocialAccount(
            user,
            createUserSocialDto.provider,
            createUserSocialDto.id_provider
        );
    }

    async validateAndLink(socialAuthLoginDto: SocialAuthLoginDto, userInstance: number) {
        const userProviderData = await this.googleAuthProvider.validate(socialAuthLoginDto.token);

        if (!userProviderData) throw new BadRequestException('Provider invalido');

        const social = await this.userSocialAuthRepository.findOne({
            where: {
                id_provider: userProviderData.id_provider,
                provider: socialAuthLoginDto.provider
            }
        });        

        if (social) {
            if (social.userId.id === userInstance)
                throw new BadRequestException('You are already linked to this account');

            throw new BadRequestException('Social account its already linked to other user');
        }

        return await this.linkSocialAccount(userInstance, socialAuthLoginDto.provider, userProviderData.id_provider);
    }

    private async linkSocialAccount(userInstance: number | User, provider: string, id_provider: string) {
        let user: any;

        if (typeof userInstance === 'number')
            user = await this.usersService.findOne(userInstance);
        else
            user = userInstance;

        const userLink = {
            provider: provider,
            id_provider: id_provider,
            id_user: user.id,
        };

        const relacao = this.userSocialAuthRepository.create(userLink);
        await this.userSocialAuthRepository.save(relacao);

        return await this.authService.generateToken(user.id);
    }
}

/*
tenta logar com social(google)
    se retornar tokens
        acessa dashboard e guarda jwt
    caso contrario
        redireciona para criar uma conta




achar uma maneira de saber que ele ja tentou logar com o google e token do google dele esta valido
    chamar uma rota que cria o User e link com o google dele
        o que eu tenho que pro back para saber que ele ja tentou logar com o google e foi validado o token dele mas n conta
            e o que mandar para o back para fazer o link?

*/