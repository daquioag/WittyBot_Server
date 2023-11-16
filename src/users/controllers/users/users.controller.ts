import {
  Body,
  NotFoundException,
  UnauthorizedException, ConflictException, 
  Get,
  Post,
  Controller, UsePipes, ValidationPipe
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { Public } from 'src/auth/auth.guard';
// controllers are for extracing query parameters
// are for validating request bodies.
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    return 'Hello!';
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() LoginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.loginUser(LoginUserDto);
      return { user, status: true }; // Return the user and status
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Handle user not found exception
        return { message: 'User not found', status: false };
      } else if (error instanceof UnauthorizedException) {
        // Handle invalid password exception
        return { message: 'Invalid password', status: false };
      } else {
        // Handle other exceptions
        return { message: 'Internal Server Error', status: false };
      }
    }
  }

  @Post('create')
  @Public()
  @UsePipes(ValidationPipe)
  async createUser(@Body() CreateUserDto: CreateUserDto) {
    try{
        const user = await this.userService.createUser(CreateUserDto);
        return { user, status: true};
    } catch(error) {
        if (error instanceof ConflictException){
            return { message: 'User with this email already exists', status: false };
        } else{
            return { message: 'Internal Server Error', status: false };

        }
    }
    
  }
}
