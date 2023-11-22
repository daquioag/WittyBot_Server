// login.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}