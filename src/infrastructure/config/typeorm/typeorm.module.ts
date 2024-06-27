import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnvironmentService } from '~infrastructure/config/environment/environment.service';
import { EnvironmentModule } from '~infrastructure/config/environment/environment.module';

export const getTypeOrmModuleOptions = (
  config: EnvironmentService,
): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: config.getDatabaseSync(),
  }) as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
