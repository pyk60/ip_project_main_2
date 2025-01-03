import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({ example: 'My Post Title' })
  title: string;

  @ApiProperty({ example: 'This is the content of the post.' })
  content: string;

  @ApiProperty({ example: PostType.USER_WALL, enum: PostType })
  type: PostType;

  @ApiProperty({
    example: 1,
    description: 'The ID of the drama this post is associated with',
    required: false,
  })
  dramaId?: number;
}
