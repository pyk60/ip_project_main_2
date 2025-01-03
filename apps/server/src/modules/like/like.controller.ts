import { Controller, Post, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post/:postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like for a post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully toggled the like status of the post.',
  })
  @ApiResponse({ status: 404, description: 'Post or user not found.' })
  async togglePostLike(
    @GetUser('id') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.likeService.toggleLikePost(userId, postId);
  }

  @Post('drama/:dramaId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like for a drama' })
  @ApiResponse({
    status: 200,
    description: 'Successfully toggled the like status of the drama.',
  })
  @ApiResponse({ status: 404, description: 'Drama or user not found.' })
  async toggleDramaLike(
    @GetUser('id') userId: number,
    @Param('dramaId') dramaId: number,
  ) {
    return this.likeService.toggleLikeDrama(userId, dramaId);
  }
}
