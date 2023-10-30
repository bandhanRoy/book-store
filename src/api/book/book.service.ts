import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregateOptions,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { logger } from '../../config/logger';
import { CreateBookDto } from './dto/create-book.dto';
import { BookJoinedAuthor } from './responses/success.response';
import { Book } from './schemas/book.schema';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>
  ) {}

  async registerBook(createBookDto: CreateBookDto): Promise<Book> {
    logger.log(`${this.constructor.name}.registerBook: Inside register book`);
    const book = new this.bookModel({
      name: createBookDto.name,
      summary: createBookDto.summary,
      authors: createBookDto.authors.map(
        (author) => new Types.ObjectId(author)
      ),
    });
    const savedBook = await book.save();
    if (savedBook) {
      logger.debug(
        `${this.constructor.name}.registerBook: Book saved successfully`
      );
    }
    return savedBook;
  }

  async updateBook(
    bookId: string,
    updateBookDto: UpdateBookDto
  ): Promise<boolean> {
    logger.log(`${this.constructor.name}.updateBook: Inside update book`);
    const { name, authors, summary } = updateBookDto;
    const updateBooks = await this.updateBookDetails(
      { _id: bookId },
      {
        $set: {
          name,
          summary,
          ...(authors?.length
            ? {
                authors: authors.map((user) => new Types.ObjectId(user)),
              }
            : {}),
        },
      }
    );
    if (!updateBooks.modifiedCount) {
      logger.debug(
        `${this.constructor.name}.updateBook: Book cannot be updated`
      );
      return false;
    }
    return true;
  }

  async getBookData(id: string): Promise<BookJoinedAuthor | null> {
    logger.log(`${this.constructor.name}.getBookData: Inside book details`);
    const bookDetails = await this.bookAggregate<BookJoinedAuthor>([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'authors',
          localField: 'authors',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'authors',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          summary: 1,
          authors: 1,
        },
      },
    ]);
    if (!bookDetails.length) {
      logger.debug(`${this.constructor.name}.getBookData: Book not found`);
      return null;
    }
    return bookDetails[0];
  }

  async deleteBook(id: string): Promise<boolean> {
    const deleted = await this.bookModel.deleteOne({ _id: id });
    if (!deleted.deletedCount) {
      logger.debug(`${this.constructor.name}.deleteBook: Book is not deleted`);
      return false;
    }
    return true;
  }

  async getBookDetails<T>(
    filter: FilterQuery<Book>,
    projection?: ProjectionType<Book>,
    options?: QueryOptions<Book>
  ): Promise<T extends undefined ? Book : T> {
    return await this.bookModel.findOne<T extends undefined ? Book : T>(
      filter,
      projection,
      options
    );
  }

  async updateBookDetails(
    filter?: FilterQuery<Book>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<Book>,
    options?: QueryOptions<Book>
  ): Promise<ReturnType<(typeof Model)['updateOne']>> {
    return await this.bookModel.updateOne(filter, update, options);
  }

  async getAllBookDetails<T>(
    filter: FilterQuery<Book>,
    projection?: ProjectionType<Book>,
    options?: QueryOptions<Book>
  ): Promise<(T extends undefined ? Book : T)[]> {
    return await this.bookModel.find<T extends undefined ? Book : T>(
      filter,
      projection,
      options
    );
  }

  async bookAggregate<T>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ): Promise<T[]> {
    return await this.bookModel.aggregate(pipeline, options);
  }
}
