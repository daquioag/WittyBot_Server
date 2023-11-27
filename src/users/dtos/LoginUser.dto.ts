// login.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password' })
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}