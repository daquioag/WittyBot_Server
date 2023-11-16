import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super();
    }

    async validate(email: string,  password: string){
        console.log("Validate User!asdfsdfsfd")
        const user = await this.authService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException();
        }
        return user
    }
}