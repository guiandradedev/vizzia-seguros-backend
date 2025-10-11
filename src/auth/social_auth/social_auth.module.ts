import { Module } from '@nestjs/common';
import { SocialAuthController } from './social_auth.controller';
import { SocialAuthService } from './social_auth.service';
import { GoogleAuthProvider } from './providers/google_auth/google_auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSocialAuth } from './entities/user_social_auth.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSocialAuth]),
    UsersModule
  ],
  controllers: [SocialAuthController],
  providers: [SocialAuthService, GoogleAuthProvider]
})
export class SocialAuthModule {}
