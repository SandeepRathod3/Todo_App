import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import path from 'path';
import { Logger } from '@nestjs/common';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const logger = new Logger('Bootstrap');

async function bootstrap() {

  logger.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'Loaded' : 'NOT LOADED'}`);
  logger.log(`PORT: ${process.env.PORT || 3000}`);
  
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` Server running on http://localhost:${port}/api/v1`)}

bootstrap();

