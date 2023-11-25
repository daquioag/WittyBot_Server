import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm';
import { RequestTracking } from '../typeorm';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/services/request/request.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, RequestTracking]), RequestModule],
    controllers: [UsersController],
    providers: [ {
        provide: 'USER_SERVICE',
        useClass: UsersService,
    },{
        provide: 'REQUEST_SERVICE',
        useClass: RequestService,
    }, UsersService, 


]
})
export class UsersModule { }
