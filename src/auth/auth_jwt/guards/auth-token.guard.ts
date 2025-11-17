import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenTypes } from 'src/auth/enums/tokenTypes.enum';
import { Reflector } from '@nestjs/core';
import { ALLOWED_TOKEN_TYPES_KEY } from 'src/auth/decorators/allowed-token-types.decorator';
import { UsersService } from 'src/user/users/users.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof import('../config/jwt.config').default>,
    private readonly reflector: Reflector,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const allowedTokenTypes = this.reflector.getAllAndOverride<TokenTypes[]>(ALLOWED_TOKEN_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [TokenTypes.ACCESS];

    if (!token) {
      throw new UnauthorizedException('nao logado')
    }

    try {
      const payload = await this.jwtservice.verifyAsync(
        token,
        this.jwtConfiguration
      );

      if (!allowedTokenTypes.includes(payload.type))
        throw new UnauthorizedException('Token invalido');

      const user = await this.usersService.findUserEntityById(payload.sub);

      if (!user)
          throw new UnauthorizedException('user invalido');

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

    }catch (error) {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

        if (!authorization || typeof authorization !== 'string') {
            return;
        }

        return authorization.split(' ')[1];
  }
}
