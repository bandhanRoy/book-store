import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../../responses/success.response';
import { Book } from '../../book/responses/book.response';
import { Author } from './author.response';

export class CreateAuthorSuccessResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: '653f7273d219dd8b31a7754c',
  })
  result: string;
}

export class GetAllAuthorsResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: [
      {
        _id: '653f7252d219dd8b31a77549',
        name: 'Test User1',
        email: 'testuser1@gmail.com',
      },
    ],
  })
  result: Author[];

  @ApiProperty({
    description: 'Result Info',
    nullable: false,
    example: { page: 1, perPage: 30 },
  })
  resultInfo: { page: number; perPage: number };
}

export class AuthorJoinedBooks extends Author {
  books: Book[];
}

export class GetAuthorResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: false,
    example: [
      {
        _id: '653f7252d219dd8b31a77549',
        email: 'testuser1@gmail.com',
        name: 'Test User1',
        books: [
          {
            _id: '653f7273d219dd8b31a7754c',
            name: 'Book1',
          },
        ],
      },
    ],
  })
  result: AuthorJoinedBooks[];
}
