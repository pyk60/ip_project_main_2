import { Like } from 'src/modules/like/entities/like.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Drama } from '../../drama/entities/drama.entity';
import { User } from '../../user/entities/user.entity';

export enum PostType {
  USER_WALL = 'wall',
  DRAMA = 'drama',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.USER_WALL,
  })
  type: PostType;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Drama, (drama) => drama.posts, { nullable: true })
  @JoinColumn({ name: 'dramaId' })
  drama?: Drama;

  @Column({ nullable: true })
  dramaId?: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  likeCount: number;
}
