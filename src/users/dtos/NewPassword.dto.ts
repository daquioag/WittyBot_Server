// login.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty({ example: 'newpassword123', description: 'The new password' })
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}