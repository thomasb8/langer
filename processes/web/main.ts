import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/AppModule';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
    cors: {
      origin: (origin, cb) => {
        if (origin && !JSON.parse(process.env.CORS_ORIGINS || '[]').includes(origin)) {
          return cb(new NotFoundException());
        }
        cb(null, true);
      },
      credentials: true
    }
  });
  await app.listen(3001);
}
bootstrap();
