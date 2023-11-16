import {
  Body,
  ValidationPipe,
  UsePipes,
  Controller,
  Post,
  Get, Res,
  HttpCode,
  HttpStatus, Request,
  NotFoundException,
  UnauthorizedException, UseGuards
} from '@nestjs/common';
import { AuthGuard, Public } from '../../auth.guard';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { AuthService } from '../../services/auth/auth.service';
// controllers are for extracing query parameters
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  async loginUser(@Body() LoginUserDto: LoginUserDto) {
    try {
      const access_token = await this.authService.signInUser(LoginUserDto);
      return { access_token, status: true }; // Return the user and status
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

  @HttpCode(HttpStatus.OK)
  @Post('login2')
  @Public()
  @UsePipes(ValidationPipe)
  async loginUser2(@Request() req) {
    
  }

  
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('user_token', '', { expires: new Date(Date.now()) });
    return {};
  }

  
}
