import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log(request)
    // console.log("request")
    const token = this.extractTokenFromCookie(request);
    console.log("HELHEROHERH")
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      console.log
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const cookies = request.headers.cookie;
    if (cookies) {
      console.log(cookies)
      const cookieArray = cookies.split(';').map(cookie => cookie.trim());
      const tokenCookie = cookieArray.find(cookie => cookie.startsWith('access_token='));
      console.log(tokenCookie)
      if (tokenCookie) {
        return tokenCookie.split('=')[1];
      }
    }
    return undefined;
  }
  
}
