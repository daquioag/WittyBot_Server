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

    // @IsNumber()
    // apicalls: number;

    // @IsString()
    // token: string;

    // @IsBoolean()
    // admin: boolean;
}