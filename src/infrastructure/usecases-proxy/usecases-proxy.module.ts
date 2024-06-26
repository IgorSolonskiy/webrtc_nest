import { DynamicModule, Module } from '@nestjs/common';

import { LoginUseCases } from '~usecases/auth/login.usecases';

@Module({})
export class UsecasesProxyModule {
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: () => new LoginUseCases(),
        },
      ],
      exports: [UsecasesProxyModule.LOGIN_USECASES_PROXY],
    };
  }
}
