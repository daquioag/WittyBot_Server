import {IsNotEmpty, MinLength, IsBoolean, IsNumber, IsString} from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @IsNotEmpty()
    @MinLength(2)
    password: string;

    @IsNotEmpty()
    email: string;

    @IsBoolean()
    admin?: boolean = false; // Making 'admin' optional with a default value of 'false'
}