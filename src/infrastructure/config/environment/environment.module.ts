import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from '~infrastructure/config/environment/environment.validation';
import { EnvironmentService } from '~infrastructure/config/environment/environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'test' || false,
      isGlobal: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
