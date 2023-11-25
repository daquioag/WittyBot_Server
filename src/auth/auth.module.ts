import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
// import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from 'src/users/services/users/users.service';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtStrategy } from './utils/JwtStrategy';
import { RequestService } from 'src/request/services/request/request.service';
import { RequestTracking } from '../typeorm';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RequestTracking]),
    RequestModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    {
      provide: 'REQUEST_SERVICE',
      useClass: RequestService,
    },
    AuthService,
    JwtStrategy,
    RequestService,
  ],
})
export class AuthModule {}
