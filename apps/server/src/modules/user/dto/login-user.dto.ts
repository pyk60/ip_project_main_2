import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john_doe' })
  usernameOrEmail: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
