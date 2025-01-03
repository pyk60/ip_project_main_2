import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin_user' })
  username: string;

  @ApiProperty({ example: 'admin_password' })
  password: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;
}
