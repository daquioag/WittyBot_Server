// login.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'new.user@example.com', description: 'The email address of the user' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'The password of the user' })
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}