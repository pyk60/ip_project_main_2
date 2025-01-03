import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../post/entities/post.entity';
import { Drama } from '../drama/entities/drama.entity';
import { User } from '../user/entities/user.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, Drama, User])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
