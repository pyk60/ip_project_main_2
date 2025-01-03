import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Like } from 'src/modules/like/entities/like.entity';

@Entity()
export class Drama {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  releaseDate: string;

  @Column()
  genre: string;

  @OneToMany(() => Post, (post) => post.drama)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.drama)
  likes: Like[];

  @Column({ default: 0 })
  likeCount: number;
}
