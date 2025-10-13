import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/users/users.service';
import { HashingServiceProtocol } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import * as config from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenTypes } from '../enums/tokenTypes.enum';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {
        console.log(this.jwtConfiguration);
    }

    async login(loginDto: LoginDto) {
        let passwordIsValid = false;
        let throwError = true;

        const user = await this.usersService.findByEmail(loginDto.email);

        if (user) {
            passwordIsValid = await this.hashingService.compare(loginDto.password, user.passwordHash);
        }

        if (passwordIsValid) throwError = false;

        if (throwError) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id);
    }

    async generateToken(userID: number) {
        const accestokenPromise = this.jwtsign(
            this.jwtConfiguration.ttl,
            TokenTypes.ACCESS,
            userID.toString(),
        );

        const refreshtokenPromise = this.jwtsign(
            this.jwtConfiguration.refreshTtl,
            TokenTypes.REFRESH,
            userID.toString(),
        );

        const [accessToken, refreshToken] = await Promise.all([
            accestokenPromise,
            refreshtokenPromise
        ]);

        return {
            accessToken,
            refreshToken
        };
    }

    private async jwtsign<T>(expiresIn: number, type: string ,userID?: string, payload?: T) {
        return this.jwtService.signAsync(
            {
                sub: userID,
                type: type,
                ...payload
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: expiresIn,
            }
        )
    }

    async refreshToken(refreshToken: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync(
                refreshToken.refreshToken,
                this.jwtConfiguration
            );

            const user = await this.usersService.findOne(sub);

            if (!user) throw new UnauthorizedException('User not found');

            return this.generateToken(user.id);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async logout(request: Request, refreshToken: string) {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Insert into blacklist
    }

    async createUserSocialToken(provider: string, id_provider: string, provider_email: string, name: string) {
        const payload = {
            provider,
            provider_email,
            name
        };

        const createUserSocialToken = await this.jwtsign(
            this.jwtConfiguration.createUserSocialTtl,
            TokenTypes.CREATEUSERSOCIAL,
            id_provider,
            payload,
        );

        return createUserSocialToken;
    }
}
