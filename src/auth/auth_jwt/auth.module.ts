import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingServiceProtocol,
    useClass: BcryptService, 
    }
  ],
  exports: [HashingServiceProtocol, AuthService, JwtModule, ConfigModule],
})
export class AuthModule {}
