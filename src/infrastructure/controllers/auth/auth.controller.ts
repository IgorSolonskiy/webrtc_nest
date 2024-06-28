import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LoginUseCases } from '~usecases/auth/login.usecases';
import { RegisterUseCases } from '~usecases/auth/register.usecases';
import { LogoutUseCases } from '~usecases/auth/logout.usecases';
import { RefreshUseCases } from '~usecases/auth/refresh.usecases';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUserDto } from '~infrastructure/dto/create-user.dto';
import { LoginUserDto } from '~infrastructure/dto/login-user.dto';
import { AuthGuard } from '~infrastructure/common/guards/auth.guard';
import { RefreshGuard } from '~infrastructure/common/guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: RegisterUseCases,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: LoginUseCases,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCaseProxy: LogoutUseCases,
    @Inject(UsecasesProxyModule.REFRESH_USECASES_PROXY)
    private readonly refreshUseCaseProxy: RefreshUseCases,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @ApiOperation({ description: 'register' })
  async register(@Body() data: CreateUserDto) {
    return await this.registerUseCaseProxy.execute(data);
  }

  @Post('login')
  @ApiOperation({ description: 'login' })
  async login(@Req() request, @Body() data: LoginUserDto) {
    const tokens = await this.loginUseCaseProxy.execute(data);
    request.res.setHeader('Set-Cookie', tokens);
    return { message: 'ok' };
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @ApiOperation({ description: 'refresh' })
  async refresh(@Request() request) {
    const { id, email, username } = request.user;
    const accessToken = await this.refreshUseCaseProxy.execute({
      id,
      email,
      username,
    });

    request.res.setHeader('Set-Cookie', accessToken);
    return { message: 'ok' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request) {
    const cookie = await this.logoutUseCaseProxy.execute(request.user);
    request.res.setHeader('Set-Cookie', cookie);
    return { message: 'ok' };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
