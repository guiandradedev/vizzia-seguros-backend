import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { SocialAuthValidateDto } from 'src/auth/social_auth/dto/social_authValidate.dto';
import { SocialAuthProvider } from 'src/auth/social_auth/interface/social-auth-provider.interface';

@Injectable()
export class GoogleAuthProvider implements SocialAuthProvider{
    private readonly googleClient: OAuth2Client;

    constructor() {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validate(token: string): Promise<SocialAuthValidateDto | null> {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) return null;
        
        return {
            id_provider: payload.sub,
            email: payload.email ?? '',
            name: payload.name ?? ''
        }
    }
}