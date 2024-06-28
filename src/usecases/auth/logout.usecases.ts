import { IUserRepository } from '~domain/repositories/userRepository.interface';
import { IJwtServicePayload } from '~domain/adapters/jwt.interface';

export class LogoutUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ email }: IJwtServicePayload) {
    await this.userRepository.clearRefreshToken(email);
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
