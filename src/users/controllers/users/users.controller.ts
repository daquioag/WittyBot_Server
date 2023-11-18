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
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Public } from 'src/auth/auth.guard';
import { Response } from 'express';
import { DeleteUserDto } from 'src/users/dtos/DeleteUser.dto';

// controllers are for extracing query parameters
// are for validating request bodies.
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('getUsers')
  getUsers() {
    return this.userService.findUsers();
  }

  @Delete('delete')
  async deleteUser(@Res({ passthrough: true }) res: Response, @Body() DeleteUserDto: DeleteUserDto): Promise<void> {
    try {
      // await this.userService.deleteUser(DeleteUserDto);
      const deletedUser = await this.userService.deleteUser(DeleteUserDto);
      console.log(deletedUser)
      res.status(HttpStatus.OK).send({ status: 'ok', success: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error('User not found');
        res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found', status: false });
      } else {
        console.error('Internal Server Error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error', status: false });
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
      console.log(user)
      res
        .status(HttpStatus.CREATED)
        .send({ status: 'ok', user, success: true });
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error('User with this email already exists');
        res
          .status(HttpStatus.CONFLICT)
          .send({ message: 'User with this email already exists', status: false });
      } else {
        console.error('Internal Server Error');
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal Server Error', status: false });
      }
    }
  }
}
