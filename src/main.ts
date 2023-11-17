import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: {
    origin: 'http://localhost:5500',
    credentials: true,
  } }); // Enable CORS
  app.use(cookieParser()); // cookie parser middleware
  await app.listen(3000);
  app.use(cors(

    {
      origin: 'http://localhost:5500',  // Replace with your client-side application's URL
      credentials: true,  // This enables the use of cookies or other credentials sent with the request
    }
  ));
}
bootstrap();
