import {
  Body,
  ConflictException,
  Get,
  Res,
  Post,
  HttpCode,
  HttpStatus,
  Controller,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  Delete,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Public } from 'src/auth/auth.guard';
import { Response, Request } from 'express';
import { DeleteUserDto } from 'src/users/dtos/DeleteUser.dto';
import { User } from 'src/users/types';
import { NewPasswordDto } from 'src/users/dtos/NewPassword.dto';

// controllers are for extracing query parameters
// are for validating request bodies.
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Get('getUsers')
  getUsers() {
    return this.userService.findUsers();
  }

  @Delete('delete')
  async deleteUser(
    @Res({ passthrough: true }) res: Response,
    @Body() DeleteUserDto: DeleteUserDto,
  ): Promise<void> {
    try {
      await this.userService.deleteUser(DeleteUserDto);
      res.status(HttpStatus.OK).send({ status: 'ok', success: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error('User not found');
        res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'User not found', status: false });
      } else {
        console.error('Internal Server Error:', error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error', status: false });
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  @Public()
  @UsePipes(ValidationPipe)
  async createUser(
    @Res({ passthrough: true }) res: Response,
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<void> {
    try {
      const user = await this.userService.createUser(CreateUserDto);
      res
        .status(HttpStatus.CREATED)
        .send({ status: 'ok', user, success: true });
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error('User with this email already exists');
        res
          .status(HttpStatus.CONFLICT)
          .send({
            message: 'User with this email already exists',
            status: false,
          });
      } else {
        console.error('Internal Server Error');
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error', status: false });
      }
    }
  }

  @Get('getRole')
  @HttpCode(HttpStatus.OK)
  async getUserRole(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const user = req.user as User;
      console.log(user.admin);
      res.status(HttpStatus.OK).send({
        status: 'ok',
        admin: user.admin,
        success: true,
      });
    } catch (error) {
      console.error('Error retrieving user profile:', error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: 'error',
        message: 'Internal Server Error',
        success: false,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async updatePassword(
    @Req() req: Request,  
    @Res({ passthrough: true }) res: Response,
    @Body() NewPasswordDto: NewPasswordDto,
  ): Promise<void> {
    try {
      const user = req.user as User;
      const password  = NewPasswordDto.password
      await this.userService.patchUser(user.id, NewPasswordDto);

      res
        .status(HttpStatus.OK)
        .send({ status: 'ok', newpassword : password, message: 'Password updated successfully', success: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error('User does not exist');
        res
          .status(HttpStatus.NOT_FOUND)
          .send({
            message: 'User does not exist',
            success: false,
            status: 'error'
          });
      } else {
        console.error('Internal Server Error');
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error', success: false, status: 'error' });
      }
    }
  }


}
