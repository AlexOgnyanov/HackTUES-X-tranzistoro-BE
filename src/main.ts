import * as fs from 'fs';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/public-certificate.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('ENV');

  if (nodeEnv === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('Backoffice API')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
        },
        'AccessToken',
      )
      .addBearerAuth({ type: 'http' }, 'RefreshToken')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT');

  await app.listen(port || 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
