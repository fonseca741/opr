import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/databases/postgres/entities/user-entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { OrcidModule } from '../orcid/orcid.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User]), OrcidModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
