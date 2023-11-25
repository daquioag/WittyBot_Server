import { MiddlewareConsumer, Module, NestModule, RequestMethod  } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm';
import { RequestTracking } from '../typeorm';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/services/request/request.service';
import { RequestLoggerMiddleware } from 'src/auth/request-logger.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([User, RequestTracking]), RequestModule],
    controllers: [UsersController],
    providers: [ {
        provide: 'USER_SERVICE',
        useClass: UsersService,
    },{
        provide: 'REQUEST_SERVICE',
        useClass: RequestService,
    }, UsersService, RequestService


]
})
export class UsersModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(RequestLoggerMiddleware).exclude(
        { method: RequestMethod.GET, path: '/stats/incrementFetchJoke' },
        { method: RequestMethod.GET, path: '/stats/incrementGetHealthTip' },
      ).forRoutes('*');
    }
  }