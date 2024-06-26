import { Module } from '@nestjs/common';

import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';

import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [AuthController],
})
export class ControllersModule {}
