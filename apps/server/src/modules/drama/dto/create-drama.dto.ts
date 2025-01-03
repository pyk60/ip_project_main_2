import { ApiProperty } from '@nestjs/swagger';

export class CreateDramaDto {
  @ApiProperty({ example: 'My Drama Title' })
  title: string;

  @ApiProperty({ example: 'This is a description of the drama.' })
  description: string;

  @ApiProperty({ example: '2024-01-01' })
  releaseDate: string;

  @ApiProperty({ example: 'Romance' })
  genre: string;
}
