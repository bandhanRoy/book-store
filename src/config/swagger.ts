import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Book Store API')
  .setDescription('A crud API to add books and authors')
  .setVersion('1.0')
  .addTag('authors')
  .addTag('books')
  .build();
