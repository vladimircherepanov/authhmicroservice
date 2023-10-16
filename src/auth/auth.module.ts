import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtService],
})
export class AuthModule {}
