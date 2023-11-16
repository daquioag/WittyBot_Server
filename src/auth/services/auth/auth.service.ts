import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/';
import { LoginUserParams } from '../../types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/services/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';
// service class is responsible for all business logic
// like calling APIs
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInUser(userDetails: LoginUserParams) {
    const { email, password } = userDetails;
    // Try to find a user with the given username
    try {
      const user = await this.userService.loginUser({ email, password });
      const payload = { sub: user.email, email: user.email };
      return this.jwtService.signAsync(payload);
    } catch (error) {
      return { message: 'Internal Server Error', status: false };
    }
  }

  async validateUser(email: string, password: string) {
    const userDB = await this.userService.findUserByEmail(email);

    if (userDB) {
      const matched = comparePasswords(password, userDB.password);
      if (matched) {
        console.log('USER FOUND!');
        return userDB;
      } else {
        console.log('Passwords dont match!');
        return null;
      }
    }
    console.log('User validation failed!');
    return null;
  }
}
