import {
  Body,
  ConflictException,
  Get,
  Res,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  HttpCode,
  HttpStatus,
  Controller,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  Delete,
  Req,
  Inject,
  
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { Public } from 'src/auth/auth.guard';
import { Response, Request } from 'express';
import { DeleteUserDto } from 'src/users/dtos/DeleteUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { User } from 'src/users/types';
import { NewPasswordDto } from 'src/users/dtos/NewPassword.dto';
import { RequestService } from 'src/request/services/request/request.service';
import * as strings from '../../../utils/strings';
import { ApiResponse, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

// controllers are for extracing query parameters
// are for validating request bodies.
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('REQUEST_SERVICE') private requestService: RequestService,
    private userService: UsersService) {}

  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: {
      example: [
        {
          username: strings.EXAMPLE_USERNAME,
          email: strings.EXAMPLE_EMAIL,
          apiCalls: 12,
          admin: false
        },
        // Add more examples if needed
      ],
    },
  })
  @Get('getUsers')
   getUsers() {
    return this.userService.findUsers();
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: strings.USER_NOT_FOUND })
  @ApiResponse({ status: 500, description: strings.INTERNAL_SERVER_ERROR })
  @Delete('delete')
  async deleteUser(
    @Res({ passthrough: true }) res: Response,
    @Body() DeleteUserDto: DeleteUserDto,
  ): Promise<void> {

    try {
      await this.userService.deleteUser(DeleteUserDto);
      res.status(HttpStatus.OK).send({ status: strings.Ok, success: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(strings.USER_NOT_FOUND);
        res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: strings.USER_NOT_FOUND, status: false });
      } else {
        console.error(strings.INTERNAL_SERVER_ERROR, error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: strings.INTERNAL_SERVER_ERROR, status: false });
      }
    }
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: 1,
        username: strings.EXAMPLE_USERNAME,
        email: strings.EXAMPLE_EMAIL,
      },
    },
  })
  @ApiOperation({ summary: 'create user by email, password, and username' })
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
        console.error(strings.USER_ALREADY_EXISTS);
        res.status(HttpStatus.CONFLICT).send({
          message: strings.USER_ALREADY_EXISTS,
          status: false,
        });
      } else {
        console.error(strings.INTERNAL_SERVER_ERROR);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: strings.INTERNAL_SERVER_ERROR, status: false });
      }
    }
  }

  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      example: {
        status: strings.Ok,
        admin: false,
        apiCalls: 42,
        success: true,
      },
    },
  })
  @ApiOperation({ summary: 'get user information' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('getInfo')
  @HttpCode(HttpStatus.OK)
  async getUserInfo(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ){
    try {
      const user = req.user as User;
      const userDB = await this.userService.findUserByEmail(user.email);
      return {
          status: strings.Ok,
          admin: userDB.admin,
          apiCalls: userDB.apiCalls,
          success: true,
      }
    } catch (error) {
      console.error(strings.ERROR_RETRIEVING_PROFILE, error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: strings.GENERIC_ERROR,
        message: strings.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      example: {
        status: strings.Ok,
        newpassword: strings.EXAMPLE_PASSWORD,
        message: strings.PASSWORD_UPDATED_SUCCESSFULLY,
        success: true,
      },
    },
  })  
  @ApiBody({ type: NewPasswordDto })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'update password' })
  @UsePipes(ValidationPipe)
  async updatePassword(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() NewPasswordDto: NewPasswordDto,
  ): Promise<void> {
    try {
      const user = req.user as User;
      const password = NewPasswordDto.password;
      await this.userService.resetPassword(user.id, password);

      res.status(HttpStatus.OK).send({
        status: 'ok',
        newpassword: password,
        message: strings.PASSWORD_UPDATED_SUCCESSFULLY,
        success: true,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(strings.USER_DOES_NOT_EXIST);
        res.status(HttpStatus.NOT_FOUND).send({
          message: strings.USER_DOES_NOT_EXIST,
          success: false,
          status: strings.GENERIC_ERROR,
        });
      } else {
        console.error(strings.INTERNAL_SERVER_ERROR);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: strings.INTERNAL_SERVER_ERROR,
          success: false,
          status: strings.GENERIC_ERROR,
        });
      }
    }
  }


  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'User found',
    schema: {
      example: {
        username: strings.EXAMPLE_USERNAME,
        email:strings.EXAMPLE_EMAIL,
        admin: true
      },
    },
  })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.fetchUserById(id);

      if (!user) {
        throw new NotFoundException(strings.USER_NOT_FOUND);
      }
      const {username, email, admin} = user
      return res.status(HttpStatus.OK).json({username, email, admin});
    } catch (error) {
      // Handle different types of errors that may occur during the process
      if (error instanceof NotFoundException) {
        console.error(strings.USER_NOT_FOUND);
        return res.status(HttpStatus.NOT_FOUND).json({
          message: strings.USER_NOT_FOUND,
          success: false,
          status: strings.GENERIC_ERROR,
        });
      } else {
        console.error(strings.INTERNAL_SERVER_ERROR);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: strings.INTERNAL_SERVER_ERROR,
          success: false,
          status: strings.GENERIC_ERROR,
        });
      }
    }
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto)
    await this.userService.updateUser(id, updateUserDto);
  }
}
