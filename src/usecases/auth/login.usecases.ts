import { BadRequestException, NotFoundException } from '@nestjs/common';

import { IUserRepository } from '~domain/repositories/userRepository.interface';
import { IBcryptService } from '~domain/adapters/bcrypt.interface';
import { UserModel } from '~domain/model/user';

export class LoginUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async execute(data: Pick<UserModel, 'email' | 'password'>) {
    const user = await this.userRepository.getUserByEmail(data.email);

    if (!user) throw new NotFoundException();

    const match = await this.bcryptService.compare(
      data.password,
      user.password,
    );

    if (!match)
      throw new BadRequestException('Email or password is incorrect.');

    await this.updateLoginTime(data.email);

    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }

  async updateLoginTime(email: string) {
    await this.userRepository.updateLastLogin(email);
  }
}
