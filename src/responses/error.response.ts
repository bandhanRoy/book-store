import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    description: 'Status Code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error description',
  })
  message: string;

  @ApiProperty({
    description: 'Current date time',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'API path that is giving error',
  })
  path: string;

  @ApiProperty({
    description: 'All errors',
  })
  errors: string | string[];
}
