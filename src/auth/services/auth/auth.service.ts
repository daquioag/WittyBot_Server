import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

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

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibWUiLCJ1c2VybmFtZSI6Im1lIiwiYXBpQ2FsbHMiOjAsImlhdCI6MTcwMDIxNjM3NywiZXhwIjoxNzAwMjIzNTc3fQ.YZYYqD--apfQNnmHCwZ30ztSbKJcwQF2onjMG-rYLOQ

  async validateUser(userDetails: LoginUserParams) {
    const { username, password } = userDetails;
    const userDB = await this.userService.findUserByUsername(username);

    if (userDB) {
      const matched = comparePasswords(password, userDB.password);
      if (matched) {
        console.log('USER FOUND!');
        const payload = { sub: userDB.id, email: userDB.email, username: userDB.username, apiCalls : userDB.apicalls };
        const token = await this.jwtService.signAsync(payload);
        return token;
      } else {
        console.log("Wrong password!")
        throw new UnauthorizedException();
      }
    }
    console.log("User not found!")
    throw new NotFoundException()
  }
}
