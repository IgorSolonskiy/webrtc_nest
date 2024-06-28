import { JWTConfig } from '~domain/config/jwt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from '~domain/adapters/jwt.interface';

export class RefreshUseCases {
  constructor(
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
  ) {}

  async execute(payload: IJwtServicePayload) {
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime();
    return this.jwtTokenService.createToken(payload, secret, expiresIn);
  }
}
