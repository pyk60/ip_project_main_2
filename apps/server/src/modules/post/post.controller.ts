import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationQuery } from '../../common/dto/pagination-query.dto';
import { FetchResult } from 'src/common/classes/fetch-result';
import { Post as Posts } from './entities/post.entity';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  findAll(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Posts>> {
    return this.postService.findAll(paginationQuery);
  }

  @Get('wall')
  @ApiOperation({ summary: 'Get all wall posts' })
  @ApiResponse({ status: 200, description: 'Return all wall posts.' })
  findAllWall(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Posts>> {
    return this.postService.findAllWall(paginationQuery);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by a user' })
  @ApiResponse({ status: 200, description: 'Return all posts by the user.' })
  findByUser(
    @Param('userId') userId: string,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Posts>> {
    return this.postService.findByUser(+userId, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Return the post.' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
