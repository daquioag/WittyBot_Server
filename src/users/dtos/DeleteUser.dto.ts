// login.dto.ts
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({ example: 1, description: 'The ID of the user to be deleted' })
  @IsNotEmpty()
  id: number;
}