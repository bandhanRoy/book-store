import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { logger } from './config/logger';
import { ConfigService } from '@nestjs/config';
import { ROUTE_BASE_PATH, ROUTE_VERSION } from './constants/common.constant';
import { requestLogger } from './config/morgan';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { urlencoded } from 'express';
import { GlobalExceptionHandler } from './handlers/global-exception.handler';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger,
    cors: true,
  });
  const httpAdapter = app.get(HttpAdapterHost);
  const configService: ConfigService = app.get(ConfigService);
  app.setGlobalPrefix(ROUTE_VERSION + '/' + ROUTE_BASE_PATH);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document, {
    useGlobalPrefix: true,
  });
  // set up morgan
  app.use(requestLogger);
  // handle global errors
  app.useGlobalFilters(new GlobalExceptionHandler(httpAdapter, configService));
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  // application/x-www-form-urlencoded
  app.use(urlencoded({ extended: false }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // start the server
  const port = Number(configService.get<string>('APP_PORT') || 3000);
  await app.listen(port);
  logger.log(`Server started successfully as ${port} 🎉🎉🎉`);
}
bootstrap();
