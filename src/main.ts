import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:8000',
      'http://localhost:8000/api-docs',
      'http://localhost:3000',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(8000);
}
bootstrap();
