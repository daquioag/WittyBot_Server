import { Module } from '@nestjs/common';
import { RequestService } from './services/request/request.service';
import { RequestController } from './controllers/request/request.controller';
import { RequestTracking } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RequestTracking])],
  providers: [RequestService],
  controllers: [RequestController]
})
export class RequestModule {}
