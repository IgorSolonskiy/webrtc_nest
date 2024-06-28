export interface IJwtServicePayload {
  id: number;
  username: string;
  email: string;
}

export interface IJwtExtendedPayload extends IJwtServicePayload {
  iat: number;
  exp: number;
}

export interface IJwtService {
  checkToken(token: string, secret: string): Promise<IJwtExtendedPayload>;

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
