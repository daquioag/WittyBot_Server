import { Module } from '@nestjs/common';
import { RequestService } from './services/request/request.service';
import { RequestController } from './controllers/request/request.controller';
import { RequestTracking } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users/users.service';
import { User } from '../typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RequestTracking, User])],
  providers: [
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    {
      provide: 'REQUEST_SERVICE',
      useClass: RequestService,
    },
    RequestService,
    UsersService,
  ],
  controllers: [RequestController],
})
export class RequestModule {}
