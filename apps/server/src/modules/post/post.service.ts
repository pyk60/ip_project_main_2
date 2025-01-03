import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities/user.entity';
import { PaginationQuery } from '../../common/dto/pagination-query.dto';
import { paginateEntities } from '../../common/utils/paginate-entities';
import { FetchResult } from '../../common/classes/fetch-result';
import { PostType } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { type, dramaId } = createPostDto;

    if (type === PostType.DRAMA && !dramaId) {
      throw new BadRequestException(
        'Drama ID must be provided for drama posts',
      );
    }

    const post = this.postRepository.create({
      ...createPostDto,
      userId: user.id,
      user: user,
    });

    return this.postRepository.save(post);
  }

  async findAll(paginationQuery: PaginationQuery): Promise<FetchResult<Post>> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.drama', 'drama')
        .orderBy('post.createdAt', 'DESC');

      return await paginateEntities<Post>(queryBuilder, paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUser(
    userId: number,
    paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Post>> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .where('post.userId = :userId', { userId })
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.drama', 'drama')
        .orderBy('post.createdAt', 'DESC');

      return await paginateEntities<Post>(queryBuilder, paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllWall(
    paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Post>> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .where('post.type = :type', { type: PostType.USER_WALL })
        .leftJoinAndSelect('post.user', 'user')
        .orderBy('post.createdAt', 'DESC');

      return await paginateEntities<Post>(queryBuilder, paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'drama'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
