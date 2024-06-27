import { BadRequestException } from '@nestjs/common';

import { UserModel } from '~domain/model/user';
import { IUserRepository } from '~domain/repositories/userRepository.interface';
import { IBcryptService } from '~domain/adapters/bcrypt.interface';

export class RegisterUseCases {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  async execute(data: Partial<UserModel>): Promise<UserModel> {
    const isExistsUser = await this.userRepository.checkExistsEmail(data.email);

    if (isExistsUser) throw new BadRequestException('User already exists');

    const password = await this.bcryptService.hash(data.password);
    return await this.userRepository.create({ ...data, password });
  }
}
