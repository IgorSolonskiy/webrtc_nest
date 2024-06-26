import { Module } from '@nestjs/common';

import { ControllersModule } from '~infrastructure/controllers/controllers.module';
import { UsecasesProxyModule } from '~infrastructure/usecases-proxy/usecases-proxy.module';

@Module({
  imports: [ControllersModule, UsecasesProxyModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
