import { Module } from '@nestjs/common';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';
import { JwtModule } from '~infrastructure/services/jwt/jwt.module';
import { EnvironmentModule } from '~infrastructure/config/environment/environment.module';

import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsecasesProxyModule.register(), JwtModule, EnvironmentModule],
  controllers: [AuthController],
})
export class ControllersModule {}
