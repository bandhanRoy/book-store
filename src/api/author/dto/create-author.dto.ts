import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString({ message: 'Name can only be string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'Name of the author',
    required: true,
    example: 'Test User1',
  })
  name: string;

  @IsEmail({}, { message: 'Email needs to valid' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @ApiProperty({
    description: 'Email ID of the user',
    required: true,
    example: 'testuser1@gmail.com',
  })
  @Transform(({ value }: TransformFnParams) => value?.toLowerCase().trim())
  email: string;
}
