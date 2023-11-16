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
import { AuthGuard, Public } from '../../auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { AuthService } from '../../services/auth/auth.service';
import { Response, Request } from 'express';
// controllers are for extracing query parameters
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  async loginUser2(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() LoginUserDto: LoginUserDto) : Promise<void>{
    try {
      const access_token = await this.authService.validateUser(LoginUserDto);
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
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


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('user_token', '', { expires: new Date(Date.now()) });
    return {};
  }

  
}
