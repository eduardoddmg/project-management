import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adicione o ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades não definidas no DTO
      transform: true, // Transforma o payload em uma instância do DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
