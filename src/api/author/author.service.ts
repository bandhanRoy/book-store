import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregateOptions,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { logger } from '../../config/logger';
import { BookService } from '../book/book.service';
import { Book } from '../book/responses/book.response';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorJoinedBooks } from './responses/success.response';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
    private readonly bookService: BookService
  ) {}

  async registerAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    logger.log(
      `${this.constructor.name}.registerAuthor: Inside register author`
    );
    // check if author already exists with same email and password
    const existingAuthors = await this.getAuthorDetails({
      email: createAuthorDto.email,
    });
    if (existingAuthors)
      throw new ConflictException(
        'Author already exists with same email or password'
      );

    const author = new this.authorModel({
      name: createAuthorDto.name,
      email: createAuthorDto.email,
    });
    const savedAuthor = await author.save();
    if (savedAuthor)
      logger.debug(
        `${this.constructor.name}.registerAuthor: Author saved successfully`
      );
    return savedAuthor;
  }

  async getAuthorData(id: string): Promise<AuthorJoinedBooks | null> {
    logger.log(`${this.constructor.name}.getAuthorData: Inside author details`);
    const [author, books] = await Promise.all([
      this.getAuthorDetails<Omit<AuthorJoinedBooks, 'books'>>(
        { _id: id },
        { _id: 1, email: 1, name: 1 }
      ),
      this.bookService.getAllBookDetails<Book>(
        { authors: id },
        { _id: 1, name: 1 }
      ),
    ]);
    const obj: AuthorJoinedBooks = {
      _id: author._id,
      email: author.email,
      name: author.name,
      books,
    };
    return obj;
  }

  async getAuthorDetails<T>(
    filter: FilterQuery<Author>,
    projection?: ProjectionType<Author>,
    options?: QueryOptions<Author>
  ): Promise<T extends undefined ? Author : T> {
    return await this.authorModel.findOne<T extends undefined ? Author : T>(
      filter,
      projection,
      options
    );
  }

  async updateAuthorDetails(
    filter?: FilterQuery<Author>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<Author>,
    options?: QueryOptions<Author>
  ): Promise<ReturnType<(typeof Model)['updateOne']>> {
    return await this.authorModel.updateOne(filter, update, options);
  }

  async updateMultipleAuthorDetails(
    filter?: FilterQuery<Author>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<Author>,
    options?: QueryOptions<Author>
  ): Promise<ReturnType<(typeof Model)['updateMany']>> {
    return await this.authorModel.updateMany(filter, update, options);
  }

  async getAllAuthorDetails<T>(
    filter: FilterQuery<Author>,
    projection?: ProjectionType<Author>,
    options?: QueryOptions<Author>
  ): Promise<(T extends undefined ? Author : T)[]> {
    return await this.authorModel.find<T extends undefined ? Author : T>(
      filter,
      projection,
      options
    );
  }

  async authorAggregate<T>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ): Promise<T[]> {
    return await this.authorModel.aggregate(pipeline, options);
  }
}
