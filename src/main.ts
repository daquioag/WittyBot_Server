import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UsersService } from './users/services/users/users.service';
import { RequestService } from './request/services/request/request.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: {
    origin: ['http://localhost:5500', 
    'http://127.0.0.1:5500', 'https://comp4537.com', 'https://vivianwebdev.com', 'https://richardohata.com'],
    credentials: true,
  } }); // Enable CORS
  app.use(cookieParser()); // cookie parser middleware

  const options = new DocumentBuilder()
  .setTitle('Witty Bot Companition APIs')
  .setDescription('This API provides a set of endpoints to manage users, retrieve statistics, and handle authentication-related operations.')
  .setVersion('1.0.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://nest.comp4537.com/', 'Production environment')  // Add your production server
  .addTag('Users')
  .addTag('Auth')
  .addTag('Stats')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/api/docs', app, document);

  const userService = app.get(UsersService);
  const requestService = app.get(RequestService);

  await userService.createDefaultUser();
  await requestService.insertInitialData();

  await app.listen(3000);

}
bootstrap();
