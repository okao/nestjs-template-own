import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigTypes } from './config/configuration.type';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import validationOptions from './utils/validation-options';
import helmet from 'helmet';
import compression from 'compression';
import { LoggingInterceptor } from './libs/LoggingInterceptor';
import { HttpExceptionFilter } from './libs/HttpExceptionFilter';
import { InterceptorRequestAssociateNeededTsInterceptor } from './interceptors/interceptor_request_associate_needed.ts.interceptor';

async function bootstrap() {
  try {
    console.log('process.env.NODE_ENV: ', process.env.PORT);
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
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalInterceptors(
      new InterceptorRequestAssociateNeededTsInterceptor(),
    );

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
      .setTitle('Oevaru API V1.0')
      .setDescription('Travel and Tourism API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('oevaru/v1', app, document, {
      customSiteTitle: 'Oevaru API',
    });

    console.log(
      'configService.getOrThrow: ',
      configService.getOrThrow('port', { infer: true }),
    );

    await app.listen(configService.getOrThrow('port', { infer: true }) || 3000);
  } catch (error) {
    console.log('error: ', error);
  }
}
bootstrap();
