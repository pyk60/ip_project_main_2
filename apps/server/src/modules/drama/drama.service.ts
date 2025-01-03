import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drama } from './entities/drama.entity';
import { CreateDramaDto } from './dto/create-drama.dto';
import { UpdateDramaDto } from './dto/update-drama.dto';
import { PaginationQuery } from '../../common/dto/pagination-query.dto';
import { paginateEntities } from '../../common/utils/paginate-entities';
import { FetchResult } from '../../common/classes/fetch-result';
import { Post, PostType } from '../post/entities/post.entity';

@Injectable()
export class DramaService {
  constructor(
    @InjectRepository(Drama)
    private dramaRepository: Repository<Drama>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  create(createDramaDto: CreateDramaDto): Promise<Drama> {
    const drama = this.dramaRepository.create(createDramaDto);
    return this.dramaRepository.save(drama);
  }

  async findAll(paginationQuery: PaginationQuery): Promise<FetchResult<Drama>> {
    try {
      const queryBuilder = this.dramaRepository
        .createQueryBuilder('drama')
        .select([
          'drama.id',
          'drama.title',
          'drama.description',
          'drama.releaseDate',
          'drama.genre',
        ])
        .orderBy('drama.createdAt', 'DESC');

      return await paginateEntities<Drama>(queryBuilder, paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllDramaPosts(
    paginationQuery: PaginationQuery,
  ): Promise<FetchResult<Post>> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .where('post.type = :type', { type: PostType.DRAMA })
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.drama', 'drama')
        .orderBy('post.createdAt', 'DESC');

      return await paginateEntities<Post>(queryBuilder, paginationQuery);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number): Promise<Drama> {
    return this.dramaRepository.findOneBy({ id });
  }

  async update(id: number, updateDramaDto: UpdateDramaDto): Promise<Drama> {
    await this.dramaRepository.update(id, updateDramaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.dramaRepository.delete(id);
  }
}
