import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  IJwtExtendedPayload,
  IJwtService,
  IJwtServicePayload,
} from '~domain/adapters/jwt.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(
    token: string,
    secret: string,
  ): Promise<IJwtExtendedPayload> {
    return await this.jwtService.verifyAsync(token, { secret });
  }

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }
}
