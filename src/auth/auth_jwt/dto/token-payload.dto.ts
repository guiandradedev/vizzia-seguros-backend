export class TokenPayloadDto {
    id: number;
    name: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
    // role: string;
}