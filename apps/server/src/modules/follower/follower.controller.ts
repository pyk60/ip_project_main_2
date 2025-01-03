// src/follower/follower.controller.ts
import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

@ApiTags('followers')
@ApiBearerAuth()
@Controller('followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post(':followUserId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'Successfully followed user.' })
  followUser(
    @GetUser() user: User,
    @Param('followUserId') followUserId: number,
  ): Promise<void> {
    return this.followerService.followUser(user.id, followUserId);
  }

  @Delete(':unfollowUserId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'Successfully unfollowed user.' })
  unfollowUser(
    @GetUser() user: User,
    @Param('unfollowUserId') unfollowUserId: number,
  ): Promise<void> {
    return this.followerService.unfollowUser(user.id, unfollowUserId);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({ status: 200, description: 'Return list of followers.' })
  getFollowers(@Param('userId') userId: number): Promise<User[]> {
    return this.followerService.getFollowers(userId);
  }

  @Get(':userId/followings')
  @ApiOperation({ summary: 'Get followings of a user' })
  @ApiResponse({ status: 200, description: 'Return list of followings.' })
  getFollowings(@Param('userId') userId: number): Promise<User[]> {
    return this.followerService.getFollowings(userId);
  }
}
