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
import { ForgotPasswordDto } from 'src/users/dtos/ForgotPassword.dto';
import { AuthService } from '../../services/auth/auth.service';
import { Response, Request } from 'express';
import { User } from 'src/users/types';
import * as strings from '../../../utils/strings';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

// controllers are for extracing query parameters
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        status: 'ok',
        success: true,
      },
    },
  })
  @ApiBody({ type: LoginUserDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login user by email and password' })
  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() LoginUserDto: LoginUserDto) : Promise<void>{
    try {
      const access_token = await this.authService.validateUser(LoginUserDto);
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' // change to lax for local testing and none for hosting
          }).send({ status: strings.Ok , access_token, success: true});
    } catch (error) {
      {
        if (error instanceof NotFoundException) {
          // Handle user not found exception
          console.error(strings.USER_NOT_FOUND);
          res.status(HttpStatus.NOT_FOUND).send({ message: strings.USER_NOT_FOUND, status: false });

        } else if (error instanceof UnauthorizedException) {
          // Handle invalid password exception
          console.error(strings.INVALID_PASSWORD);
          res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid password', status: false });

        } else {
          // Handle other exceptions
          console.error(strings.INTERNAL_SERVER_ERROR);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: strings.INTERNAL_SERVER_ERROR, status: false });

        }
      }
    }
  }

  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        username: 'john_doe',
        email: 'john.doe@example.com',
        apiCalls: 12,
        admin: false,
      },
    },
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get user information by payload' })
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @ApiOperation({ summary: 'login user out' })
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      const user = req.user as User
      console.log(strings.LOGOUT_MESSAGE(user.email))
      // Expire the cookie by setting it to an expired date
      res.cookie('access_token', '', { expires: new Date(0) });
    }   
     return {message: strings.LOGGED_OUT};
  }


  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    schema: {
      example: {
        status: 'ok',
        message: 'Password reset email sent successfully',
        access_token: 'your_access_token_here',
        success: true,
      },
    },
  })
  @ApiOperation({ summary: 'send password link by email' })
  @Post('forgot-password')
  @Public() 
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: strings.PASSWORD_RESET_EMAIL_SENT,
    schema: {
      example: {
        status: strings.Ok,
        message: strings.PASSWORD_RESET_EMAIL_SENT,
        success: true,
      },
    },
  })
  async sendEmailLink(
    @Res({ passthrough: true }) res: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    try {
      const access_token = await this.authService.sendEmailLink(forgotPasswordDto);
      res.send({status: strings.Ok, message: strings.PASSWORD_RESET_EMAIL_SENT, access_token, success: true });
    } catch (error) {
      {
        if (error instanceof NotFoundException) {
          // Handle user not found exception
          console.error(strings.USER_NOT_FOUND);
          res.status(HttpStatus.NOT_FOUND).send({ message: strings.USER_NOT_FOUND, success: false });

        } else {
          // Handle other exceptions
          console.error(strings.INTERNAL_SERVER_ERROR);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: strings.INTERNAL_SERVER_ERROR, success: false });

        }
      }
    }
  }
}
