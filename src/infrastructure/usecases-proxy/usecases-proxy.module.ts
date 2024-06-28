import { DynamicModule, Module } from '@nestjs/common';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';

import { UserRepository } from '~infrastructure/repositories/user.repository';
import { BcryptService } from '~infrastructure/services/bcrypt/bcrypt.service';
import { EnvironmentModule } from '~infrastructure/config/environment/environment.module';
import { BcryptModule } from '~infrastructure/services/bcrypt/bcrypt.module';
import { RepositoriesModule } from '~infrastructure/repositories/repositories.module';

@Module({
  imports: [BcryptModule, EnvironmentModule, RepositoriesModule],
})
export class UsecasesProxyModule {
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [UserRepository, BcryptService],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (
            userRepository: UserRepository,
            bcryptService: BcryptService,
          ) => new RegisterUseCases(userRepository, bcryptService),
        },
        {
          inject: [UserRepository, BcryptService],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            userRepository: UserRepository,
            bcryptService: BcryptService,
          ) => new LoginUseCases(userRepository, bcryptService),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new LogoutUseCases(),
        },
      ],
      exports: [
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
      ],
    };
  }
}
