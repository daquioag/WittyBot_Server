import {
  Body,
  ValidationPipe,
  UsePipes,
  Controller,
  Post,
  Get, Res,
  HttpCode,
  HttpStatus, Req,
  NotFoundException,
  UnauthorizedException, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jet-auth.guard';
import { Public } from '../../auth.guard';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { AuthService } from '../../services/auth/auth.service';
import { Response, Request } from 'express';
import { User } from 'src/users/types';
// controllers are for extracing query parameters
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() LoginUserDto: LoginUserDto) : Promise<void>{
    try {
      const access_token = await this.authService.validateUser(LoginUserDto);
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
          }).send({ status: 'ok' , access_token, success: true});
    } catch (error) {
      {
        if (error instanceof NotFoundException) {
          // Handle user not found exception
          console.error('User not found');
          res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found', status: false });

        } else if (error instanceof UnauthorizedException) {
          // Handle invalid password exception
          console.error('Invalid password');
          res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid password', status: false });

        } else {
          // Handle other exceptions
          console.error('Internal Server Error');
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error', status: false });

        }
      }
    }
  }


  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      const user = req.user as User
      console.log(`Logging out of ${user.email}'s account`)
      // Expire the cookie by setting it to an expired date
      res.cookie('access_token', '', { expires: new Date(0) });
    }   
     return {message: "Logged out"};
  }

  
}
