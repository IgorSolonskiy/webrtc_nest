import { Response } from 'express';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUserDto } from '~infrastructure/dto/create-user.dto';

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @ApiOperation({ description: 'register' })
  async register(@Body() data: CreateUserDto) {
    return await this.registerUseCaseProxy.execute(data);
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
