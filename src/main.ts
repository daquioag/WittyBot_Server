import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UsersService } from './users/services/users/users.service';
import { RequestService } from './request/services/request/request.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: {
    origin: ['http://localhost:5500', 
    'http://127.0.0.1:5500', 'https://comp4537.com', 'https://vivianwebdev.com', 'https://richardohata.com'],
    credentials: true,
  } }); // Enable CORS
  app.use(cookieParser()); // cookie parser middleware
  const userService = app.get(UsersService);
  const requestService = app.get(RequestService);

  await userService.createDefaultUser();
  await requestService.insertInitialData();

  await app.listen(3000);

}
bootstrap();
