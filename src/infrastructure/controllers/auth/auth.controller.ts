import { Response } from 'express';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUserDto } from '~infrastructure/dto/create-user.dto';
import { LoginUserDto } from '~infrastructure/dto/login-user.dto';
import { AuthGuard } from '~infrastructure/common/guards/auth.guard';

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
  async login(@Res() response: Response, @Body() data: LoginUserDto) {
    const tokens = await this.loginUseCaseProxy.execute(data);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.json({ accessToken: tokens.accessToken });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ description: 'logout' })
  async logout(@Request() req, @Res() response: Response) {
    await this.logoutUseCaseProxy.execute(req.user);

    response.cookie('refreshToken', '', { httpOnly: true, maxAge: 0 });
    response.json({ message: 'ok' });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
