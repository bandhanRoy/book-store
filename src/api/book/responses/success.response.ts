import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../../responses/success.response';
import { Book } from '../../book/responses/book.response';
import { Author } from '../../author/responses/author.response';

export class CreateBookSuccessResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: '653f7273d219dd8b31a7754c',
  })
  result: string;
}

export class DefaultSuccessResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: true,
    example: null,
  })
  result: string;
}

export class GetAllBooksResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: [
      {
        _id: '653f7273d219dd8b31a7754c',
        name: 'Book1',
      },
    ],
  })
  result: Book[];

  @ApiProperty({
    description: 'Result Info',
    nullable: false,
    example: { page: 1, perPage: 30 },
  })
  resultInfo: { page: number; perPage: number };
}

export class BookJoinedAuthor extends Author {
  summary: string;
  authors: Book[];
}

export class GetBookResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: [
      {
        _id: '653f7273d219dd8b31a7754c',
        summary: 'This book is about computer science',
        name: 'Book1',
        authors: [
          {
            _id: '653f7252d219dd8b31a77549',
            name: 'Test User1',
          },
        ],
      },
    ],
  })
  result: BookJoinedAuthor[];
}
