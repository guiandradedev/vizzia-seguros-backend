import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Ou a URL do seu frontend
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true, //Usado para permitir cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
