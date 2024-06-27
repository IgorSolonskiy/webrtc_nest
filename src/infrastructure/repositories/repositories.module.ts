import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '~infrastructure/entities/user.entity';
import { TypeOrmConfigModule } from '~infrastructure/config/typeorm/typeorm.module';
import { UserRepository } from '~infrastructure/repositories/user.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
