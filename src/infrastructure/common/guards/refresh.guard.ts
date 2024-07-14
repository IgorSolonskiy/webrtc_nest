import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtTokenService } from '~infrastructure/services/jwt/jwt.service';
import { EnvironmentService as JwtConfig } from '~infrastructure/config/environment/environment.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private jwtTokenService: JwtTokenService,
    private jwtConfig: JwtConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtTokenService.checkToken(
        token,
        this.jwtConfig.getJwtRefreshSecret(),
      );
    } catch {
      throw new ForbiddenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
