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
import createRedisStore from 'connect-redis';
// import * as csurf from 'csurf';
// import * as passport from 'passport';
import * as session from 'express-session';
import createClient from 'ioredis';
import IORedis from 'ioredis';
import RedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService<ConfigTypes>);
    const client = new createClient({
      host: configService.getOrThrow('redis.host', { infer: true }),
      port: configService.getOrThrow('redis.port', { infer: true }),
    });

    client.on('error', (err) => {
      Logger.error(err);
    });

    // app.use(csurf());

    //Session
    //pls ignore the error here as it is a bug in the library itself
    // const RedisStoreSession = new RedisStore({ client: client });

    app.use(
      session({
        secret: configService.getOrThrow('session.secret', { infer: true }),
        resave: false,
        saveUninitialized: false,
        name: 'andyid',
        cookie: {
          httpOnly: true,
          secure:
            false /* configService.getOrThrow('session.secure', { infer: true }) */,
          maxAge: 60000,
        },
        // store: RedisStoreSession,
      }),
    );

    // app.use(
    //   require('express-session')({
    //     secret: configService.getOrThrow('session.secret', { infer: true }),
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //       maxAge: 60000,
    //     },
    //     store: new (require('connect-redis')(require('express-session')))({
    //       host: configService.getOrThrow('redis.host', { infer: true }),
    //       port: configService.getOrThrow('redis.port', { infer: true }),
    //       client: require('redis').createClient(),
    //       ttl: 86400,
    //     }),
    //   }),
    // );

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

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

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
