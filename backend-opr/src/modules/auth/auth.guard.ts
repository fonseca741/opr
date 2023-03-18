import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from 'src/config/env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request, roles);
  }

  private async validateRequest(request: Request, roles: string[]) {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return false;
    }

    const [, token] = bearerToken.split(' ');

    const decodedToken = verify(token, config.auth.secret);

    if (!decodedToken) {
      return false;
    }

    if (roles && !roles.includes(decodedToken['role'])) {
      return false;
    }

    return true;
  }
}
