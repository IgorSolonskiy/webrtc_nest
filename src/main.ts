import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(port);
}

bootstrap();
