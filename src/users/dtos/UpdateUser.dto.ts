import { IsNotEmpty, MinLength, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The new username' })
    @IsNotEmpty()
    @MinLength(2)
    username?: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The new email address' })
    @IsNotEmpty()
    email?: string;
    
    @ApiProperty({ example: true, description: 'Whether the user has admin privileges' })
    @IsBoolean()
    admin?: boolean;
}
