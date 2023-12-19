import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigTypes } from './config/configuration.type';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import validationOptions from './utils/validation-options';
import helmet from 'helmet';
import { LoggingInterceptor } from './libs/LoggingInterceptor';
import { HttpExceptionFilter } from './libs/HttpExceptionFilter';
import { InterceptorRequestAssociateNeededTsInterceptor } from './interceptors/interceptor_request_associate_needed.ts.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService<ConfigTypes>);

    app.enableShutdownHooks();
    app.setGlobalPrefix(
      configService.getOrThrow('apiPrefix', { infer: true }),
      {
        exclude: ['/'],
      },
    );
    app.enableVersioning({
      type: VersioningType.URI,
    });
    //TODO: commented for now to enable file upload to work
    // app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    // app.useGlobalInterceptors(
    //   new InterceptorRequestAssociateNeededTsInterceptor(),
    // );

    // Helmet
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
      }),
    );

    //Cors
    app.enableCors({
      origin: configService.getOrThrow('cors.origin', { infer: true }),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // app.use(compression());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Andy API V1.0')
      .setDescription('Andy APi')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('andy/v1', app, document, {
      customSiteTitle: 'ANDY API',
    });

    await app.listen(configService.getOrThrow('port', { infer: true }) || 3000);
  } catch (error) {
    console.log('error: ', error);
  }
}
bootstrap();
