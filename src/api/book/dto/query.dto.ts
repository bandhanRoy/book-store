import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNumber,
  IsString,
  Min,
  NotEquals,
  ValidateIf,
} from 'class-validator';

export class SearchDTO {
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: 'Search keyword can only be string' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'Search keyword',
    required: false,
    example: 'Book',
  })
  searchStr?: string;

  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Limit should be a number' })
  @Min(1, { message: 'Minimum limit should be 1' })
  @ApiProperty({
    description: 'Limit',
    required: false,
    example: 30,
  })
  limit?: number;

  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Limit should be a number' })
  @Min(1, { message: 'Minimum limit should be 1' })
  @ApiProperty({
    description: 'Page',
    required: false,
    example: 1,
  })
  page?: number;
}
