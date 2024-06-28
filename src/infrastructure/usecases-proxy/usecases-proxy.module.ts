import { DynamicModule, Module } from '@nestjs/common';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';
import { RefreshUseCases } from '~usecases/auth/refresh.usecases';

import { UserRepository } from '~infrastructure/repositories/user.repository';
import { BcryptService } from '~infrastructure/services/bcrypt/bcrypt.service';
import { EnvironmentModule } from '~infrastructure/config/environment/environment.module';
import { BcryptModule } from '~infrastructure/services/bcrypt/bcrypt.module';
import { RepositoriesModule } from '~infrastructure/repositories/repositories.module';
import { JwtModule } from '~infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from '~infrastructure/services/jwt/jwt.service';
import { EnvironmentService } from '~infrastructure/config/environment/environment.service';

@Module({
  imports: [BcryptModule, EnvironmentModule, RepositoriesModule, JwtModule],
})
export class UsecasesProxyModule {
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static REFRESH_USECASES_PROXY = 'RefreshUseCasesProxy';

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
          inject: [
            UserRepository,
            BcryptService,
            JwtTokenService,
            EnvironmentService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            userRepository: UserRepository,
            bcryptService: BcryptService,
            jwtTokenService: JwtTokenService,
            jwtConfig: EnvironmentService,
          ) =>
            new LoginUseCases(
              userRepository,
              bcryptService,
              jwtTokenService,
              jwtConfig,
            ),
        },
        {
          inject: [UserRepository],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: (userRepository: UserRepository) =>
            new LogoutUseCases(userRepository),
        },
        {
          inject: [JwtTokenService, EnvironmentService],
          provide: UsecasesProxyModule.REFRESH_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            jwtConfig: EnvironmentService,
          ) => new RefreshUseCases(jwtTokenService, jwtConfig),
        },
      ],
      exports: [
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
        UsecasesProxyModule.REFRESH_USECASES_PROXY,
      ],
    };
  }
}
