import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROUTE_POLICY_KEY, REQUEST_TOKEN_PAYLOAD_KEY } from "src/auth/auth_jwt/auth.constants";
import { RoutePolicies } from "../enum/route-policy.enum";

@Injectable()
export class RoutePolicyGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector, 
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const routePolicyRequired = this.reflector.get<RoutePolicies[] | undefined>(
            ROUTE_POLICY_KEY,
            context.getHandler()
        );

        if(!routePolicyRequired) return true; // rota publica

        const request = context.switchToHttp().getRequest();
        const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

        if(!tokenPayload){
            throw new ForbiddenException('Rota requer permisao');
        }

        if(!routePolicyRequired.includes(tokenPayload.role as RoutePolicies)){
            throw new ForbiddenException('Voce nao tem permissao para acesar esta rota');
        }

        return true;
    }
}