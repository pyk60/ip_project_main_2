import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../post/entities/post.entity';
import { Drama } from '../drama/entities/drama.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Drama)
    private readonly dramaRepository: Repository<Drama>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async toggleLikePost(userId: number, postId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.delete(existingLike.id);
      await this.postRepository.update(postId, {
        likeCount: post.likeCount - 1,
      });
      return 'Like removed';
    } else {
      // Like
      const like = this.likeRepository.create({ user, post });
      await this.likeRepository.save(like);
      await this.postRepository.update(postId, {
        likeCount: post.likeCount + 1,
      });
      return 'Like added';
    }
  }

  async toggleLikeDrama(userId: number, dramaId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const drama = await this.dramaRepository.findOne({
      where: { id: dramaId },
    });
    if (!drama) {
      throw new NotFoundException(`Drama with ID ${dramaId} not found`);
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, drama: { id: dramaId } },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.delete(existingLike.id);
      await this.dramaRepository.update(dramaId, {
        likeCount: drama.likeCount - 1,
      });
      return 'Like removed';
    } else {
      // Like
      const like = this.likeRepository.create({ user, drama });
      await this.likeRepository.save(like);
      await this.dramaRepository.update(dramaId, {
        likeCount: drama.likeCount + 1,
      });
      return 'Like added';
    }
  }
}
