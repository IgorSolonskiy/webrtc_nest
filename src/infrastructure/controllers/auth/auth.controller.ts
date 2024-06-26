import { Response } from 'express';

import { Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: RegisterUseCases,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: LoginUseCases,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCaseProxy: LogoutUseCases,
  ) {}

  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({ description: 'register' })
  async register() {
    return await this.registerUseCaseProxy.execute();
  }

  @Post('login')
  @ApiOperation({ description: 'login' })
  async login(@Res() response: Response) {
    const tokens = await this.loginUseCaseProxy.execute();

    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    response.json({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ description: 'logout' })
  async logout(@Res() response: Response) {
    await this.logoutUseCaseProxy.execute();

    response.cookie('refreshToken', '', { httpOnly: true, maxAge: 0 });
    response.json({ message: 'ok' });
  }
}
