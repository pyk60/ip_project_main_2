import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DramaService } from './drama.service';
import { DramaController } from './drama.controller';
import { Drama } from './entities/drama.entity';
import { Post } from '../post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drama, Post])],
  controllers: [DramaController],
  providers: [DramaService],
})
export class DramaModule {}
