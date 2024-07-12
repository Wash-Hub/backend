import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { BaseAPIDocument } from './common/config/swagger.documemt';
import { SwaggerModule } from '@nestjs/swagger';

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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true })); //적용을하겠다\
  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(8000);
}
bootstrap();
