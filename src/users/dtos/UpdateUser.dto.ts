import { IsNotEmpty, MinLength, IsBoolean, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsNotEmpty()
    @MinLength(2)
    username?: string;

    @IsNotEmpty()
    email?: string;

    @IsBoolean()
    admin?: boolean;
}
