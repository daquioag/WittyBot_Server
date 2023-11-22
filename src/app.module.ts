import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailController } from './mail/controllers/mail/mail.controller';
import { MailService } from './mail/services/mail/mail.service';
import { MailModule } from './mail/mail.module';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from the .env file

import entities from './typeorm';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.LOCAL_DB_PASS,
    database: process.env.LOCAL_DB,
    entities,
    synchronize: true,
  }), UsersModule, AuthModule, MailModule],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
