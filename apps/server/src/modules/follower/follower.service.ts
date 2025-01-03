// src/follower/follower.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async followUser(userId: number, followUserId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });
    const followUser = await this.userRepository.findOneBy({
      id: followUserId,
    });

    if (!user || !followUser) {
      throw new NotFoundException('User not found');
    }

    user.followings.push(followUser);
    await this.userRepository.save(user);
  }

  async unfollowUser(userId: number, unfollowUserId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.followings = user.followings.filter(
      (following) => following.id !== unfollowUserId,
    );
    await this.userRepository.save(user);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followers;
  }

  async getFollowings(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followings;
  }
}
