import {IsNotEmpty, MinLength, IsBoolean, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({ example: 'new_user', description: 'The name of the user' })
    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @ApiProperty({ example: 'P@ssw0rd', description: 'The password of the user' })
    @IsNotEmpty()
    @MinLength(2)
    password: string;

    @ApiProperty({ example: 'new.user@example.com', description: 'The email address of the user' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: false, description: 'Optional attribute. Whether the user has admin privileges' })
    @IsBoolean()
    admin?: boolean = false; // Making 'admin' optional with a default value of 'false'
}