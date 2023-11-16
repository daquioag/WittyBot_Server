import {
  Body,
  ValidationPipe,
  UsePipes,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { AuthService } from '../../services/auth/auth.service';
// controllers are for extracing query parameters
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() LoginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.loginUser(LoginUserDto);
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
  
}
