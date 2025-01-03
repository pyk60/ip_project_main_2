import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Drama } from '../../drama/entities/drama.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { nullable: true })
  post: Post;

  @ManyToOne(() => Drama, (drama) => drama.likes, { nullable: true })
  drama: Drama;

  @CreateDateColumn()
  createdAt: Date;
}
