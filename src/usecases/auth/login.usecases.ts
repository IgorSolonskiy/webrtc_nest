import { BadRequestException, NotFoundException } from '@nestjs/common';

import { IUserRepository } from '~domain/repositories/userRepository.interface';
import { IBcryptService } from '~domain/adapters/bcrypt.interface';
import { JWTConfig } from '~domain/config/jwt.interface';
import { UserModel } from '~domain/model/user';
import {
  IJwtService,
  IJwtServicePayload,
} from '~domain/adapters/jwt.interface';

export class LoginUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
  ) {}

  async execute(data: Pick<UserModel, 'email' | 'password'>) {
    const user = await this.userRepository.getUserByEmail(data.email);

    if (!user) throw new NotFoundException();

    const match = await this.bcryptService.compare(
      data.password,
      user.password,
    );

    if (!match) {
      throw new BadRequestException('Email or password is incorrect.');
    }

    const tokens = await this.getTokens(user);

    await this.updateLoginTime(data.email);

    return tokens;
  }

  async updateLoginTime(email: string) {
    await this.userRepository.updateLastLogin(email);
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const token = await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateRefreshToken(email, token);
  }

  async getTokens(user: UserModel) {
    const accessToken = this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);

    return { accessToken, refreshToken };
  }

  getAccessToken(user: UserModel) {
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime();
    return this.createToken(user, secret, expiresIn);
  }

  async getRefreshToken(user: UserModel) {
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime();
    const token = this.createToken(user, secret, expiresIn);
    await this.setCurrentRefreshToken(token, user.email);
    return token;
  }

  createToken(user: UserModel, secret: string, expiresIn: string) {
    const payload: IJwtServicePayload = this.getTokenPayload(user);
    return this.jwtTokenService.createToken(payload, secret, expiresIn);
  }

  getTokenPayload({ username, email, id }: UserModel): IJwtServicePayload {
    return { username, email, id };
  }
}
