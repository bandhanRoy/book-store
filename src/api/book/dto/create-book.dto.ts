import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsString({ message: 'Name can only be string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'Name of book',
    required: true,
    example: 'Test User1',
  })
  name: string;

  @IsMongoId({
    each: true,
    message: 'Authors cannot be empty and needs to be a valid mongoId',
  })
  @ApiProperty({
    description: 'Authors',
    example: ['653f7252d219dd8b31a77549', '653f7252d219dd8b31a77559'],
  })
  authors: string[];

  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'Summary can only be string' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'Summary of book',
    required: false,
    example: 'This book is about computer science',
  })
  summary?: string;
}
