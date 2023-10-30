import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
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
import { ErrorResponse } from '../../responses/error.response';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import {
  AuthorJoinedBooks,
  CreateAuthorSuccessResponse,
  GetAllAuthorsResponse,
  GetAuthorResponse,
} from './responses/success.response';
import { Author as AuthorResponse } from './responses/author.response';
import { SearchDTO } from './dto/query.dto';

@Controller('authors')
@ApiTags('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({ summary: 'This API adds an author' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Author added successfully',
    type: CreateAuthorSuccessResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Author already exists.',
    type: ErrorResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async registerAuthor(
    @Body() createAuthorDto: CreateAuthorDto
  ): Promise<SuccessResponseType<string>> {
    const author = await this.authorService.registerAuthor(createAuthorDto);
    if (!author)
      throw new InternalServerErrorException('Author cannot be added');
    return {
      statusCode: 201,
      message: 'Author added successfully',
      result: author._id.toString(),
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'This API fetches all the authors' })
  @ApiOkResponse({
    status: 200,
    description: 'Authors fetched successfully',
    type: GetAllAuthorsResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getAllAuthors(
    @Query() searchDto: SearchDTO
  ): Promise<PaginatedSuccessResponseType<AuthorResponse[]>> {
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
    const authors =
      await this.authorService.getAllAuthorDetails<AuthorResponse>(
        match,
        { _id: 1, name: 1, email: 1 },
        { skip: (page - 1) * limit, limit }
      );
    return {
      statusCode: 200,
      message: 'Authors fetched successfully',
      result: authors,
      resultInfo: { page, perPage: limit },
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'This API fetches an author by its ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Author details fetched successfully',
    type: GetAuthorResponse,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getAuthorDetails(
    @Param('id') id: string
  ): Promise<SuccessResponseType<AuthorJoinedBooks>> {
    const authorDetails = await this.authorService.getAuthorData(id);
    return {
      statusCode: 200,
      message: 'Author data fetched successfully',
      result: authorDetails,
    };
  }
}
