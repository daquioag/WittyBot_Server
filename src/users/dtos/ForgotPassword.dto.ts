// login.dto.ts
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address for password recovery' })
  @IsNotEmpty()
  email: string;

}