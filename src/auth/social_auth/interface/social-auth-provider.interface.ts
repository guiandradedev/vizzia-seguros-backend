import { SocialAuthValidateDto } from "../dto/social_authValidate.dto";

export interface SocialAuthProvider {
    validate(token: string): Promise<SocialAuthValidateDto | null>;
}
