import { DynamicModule, Module } from '@nestjs/common';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';

@Module({})
export class UsecasesProxyModule {
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: () => new RegisterUseCases(),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: () => new LoginUseCases(),
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
