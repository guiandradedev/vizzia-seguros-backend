import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { SocialAuthValidateDto } from 'src/auth/social_auth/dto/social_authValidate.dto';
import { SocialAuthProvider } from 'src/auth/social_auth/interface/social-auth-provider.interface';

@Injectable()
export class GoogleAuthProvider implements SocialAuthProvider{
    private readonly googleClient: OAuth2Client;

    GOOGLE_IOS_CLIENT_ID="677080891639-cg0tp3boghouel4ufan3aef1uscp34mm.apps.googleusercontent.com"
    GOOGLE_ANDROID_CLIENT_ID="677080891639-3g3baq1mi79vm7b69lopss7t1lkv1ns1.apps.googleusercontent.com"
    GOOGLE_WEB_CLIENT_ID="677080891639-m8dkttgoubltkknjv3i4o23dd7a8u7fi.apps.googleusercontent.com"

    constructor() {
        this.googleClient = new OAuth2Client();
    }

    async validate(token: string): Promise<SocialAuthValidateDto | null> {
        const audienceIds = [
            this.GOOGLE_IOS_CLIENT_ID,
            this.GOOGLE_ANDROID_CLIENT_ID,
            this.GOOGLE_WEB_CLIENT_ID
        ]
        console.log('Validating Google token with audiences:', audienceIds);
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: audienceIds,
        });

        console.log('Google Token Payload:', ticket.getPayload());
        const payload = ticket.getPayload();

        if (!payload) return null;
        
        return {
            id_provider: payload.sub,
            email: payload.email ?? '',
            name: payload.name ?? ''
        }
    }
}