import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from '~domain/repositories/userRepository.interface';
import { UserModel } from '~domain/model/user';

import { User } from '~infrastructure/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async create(data: Partial<UserModel>): Promise<UserModel> {
    const user = this.userEntityRepository.create(data);
    const userEntity = await this.userEntityRepository.save(user);

    return this.toUser(userEntity);
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    const userEntity = await this.userEntityRepository.findOne({
      where: {
        email,
      },
    });

    if (!userEntity) throw new NotFoundException();

    return this.toUser(userEntity);
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email,
      },
      { last_login: () => 'CURRENT_TIMESTAMP' },
    );
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email,
      },
      { hash_refresh_token: refreshToken },
    );
  }

  async clearRefreshToken(email: string): Promise<void> {
    await this.userEntityRepository.update(
      {
        email,
      },
      { hash_refresh_token: null },
    );
  }

  async checkExistsEmail(email: string): Promise<boolean> {
    return await this.userEntityRepository.exists({ where: { email } });
  }

  private toUser(userEntity: User): UserModel {
    const user: UserModel = new UserModel();

    user.id = userEntity.id;
    user.email = userEntity.email;
    user.username = userEntity.username;
    user.password = userEntity.password;
    user.createDate = userEntity.create_date;
    user.updatedDate = userEntity.updated_date;
    user.lastLogin = userEntity.last_login;
    user.hashRefreshToken = userEntity.hash_refresh_token;

    return user;
  }
}
