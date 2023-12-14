import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Oevaru API V1.0')
    .setDescription('Travel and Tourism API')
    .setVersion('1.0')
    .addTag('oevaru')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('oevaru', app, document);

  await app.listen(3000);
}
bootstrap();
