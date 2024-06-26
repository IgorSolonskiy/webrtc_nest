import { Response } from 'express';

import { Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';

import { LoginUseCases } from '~usecases/auth/login.usecases';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: LoginUseCases,
  ) {}

  @Post('login')
  @ApiBearerAuth()
  @ApiOperation({ description: 'login' })
  async login(response: Response) {
    const tokens = await this.loginUseCaseProxy.execute();
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async logout() {
    return 'Login successful';
  }
}
