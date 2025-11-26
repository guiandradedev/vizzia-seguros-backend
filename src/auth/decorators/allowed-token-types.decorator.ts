import { SetMetadata } from '@nestjs/common';
import { TokenTypes } from '../enums/tokenTypes.enum';

export const ALLOWED_TOKEN_TYPES_KEY = 'allowed_token_types';

export const AllowedTokenTypes = (...tokenTypes: TokenTypes[]) => 
    SetMetadata(ALLOWED_TOKEN_TYPES_KEY, tokenTypes);
