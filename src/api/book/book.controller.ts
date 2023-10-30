import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedSuccessResponseType,
  SuccessResponseType,
} from '../../@types';
import { TransformResponseInterceptor } from '../../interceptors/response.interceptor';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book as BookResponse } from './responses/book.response';
import {
  BookJoinedAuthor,
  CreateBookSuccessResponse,
  DefaultSuccessResponse,
  GetAllBooksResponse,
  GetBookResponse,
} from './responses/success.response';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchDTO } from './dto/query.dto';

@Controller('books')
@ApiTags('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({ summary: 'This API adds a book' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Book added successfully',
    type: CreateBookSuccessResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async registerBook(
    @Body() createBookDto: CreateBookDto
  ): Promise<SuccessResponseType<null>> {
    const book = await this.bookService.registerBook(createBookDto);
    if (!book) throw new InternalServerErrorException('Book cannot be added');
    return {
      statusCode: 201,
      message: 'Book added successfully',
      result: null,
    };
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'This API updates an added book' })
  @ApiOkResponse({
    status: 200,
    description: 'Book updated successfully',
    type: CreateBookSuccessResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') bookId: string
  ): Promise<SuccessResponseType<null>> {
    const updated = await this.bookService.updateBook(bookId, updateBookDto);
    if (!updated)
      throw new InternalServerErrorException('Book cannot be updated');
    return {
      statusCode: 200,
      message: 'Book updated successfully',
      result: null,
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'This API fetches all the books' })
  @ApiOkResponse({
    status: 200,
    description: 'Books fetched successfully',
    type: GetAllBooksResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getAllBooks(
    @Query() searchDto: SearchDTO
  ): Promise<PaginatedSuccessResponseType<BookResponse[]>> {
    let match = {};
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 30;
    if (searchDto.searchStr) {
      match = {
        $and: [
          { $text: { $search: searchDto.searchStr } },
          {
            name: { $regex: new RegExp(searchDto.searchStr, 'gi') },
          },
        ],
      };
    }
    const books = await this.bookService.getAllBookDetails<BookResponse>(
      match,
      { _id: 1, name: 1 },
      { skip: (page - 1) * limit, limit }
    );
    return {
      statusCode: 200,
      message: 'Books fetched successfully',
      result: books,
      resultInfo: { page, perPage: limit },
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'This API fetches an book by its ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Book details fetched successfully',
    type: GetBookResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getBookDetails(
    @Param('id') id: string
  ): Promise<SuccessResponseType<BookJoinedAuthor>> {
    const bookDetails = await this.bookService.getBookData(id);
    return {
      statusCode: 200,
      message: 'Book data fetched successfully',
      result: bookDetails,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'This API deletes a book by its ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Book deleted successfully',
    type: DefaultSuccessResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async deleteBookDetails(
    @Param('id') id: string
  ): Promise<SuccessResponseType<null>> {
    const deleted = await this.bookService.deleteBook(id);
    if (!deleted)
      throw new InternalServerErrorException('Book cannot be deleted');
    return {
      statusCode: 200,
      message: 'Book data deleted successfully',
      result: null,
    };
  }
}
