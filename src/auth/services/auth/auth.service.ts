import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/';
import { LoginUserParams } from '../../types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/services/users/users.service';
// service class is responsible for all business logic
// like calling APIs
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, 
    private jwtService: JwtService,
      ) {}
    
  async loginUser(userDetails: LoginUserParams) {
    const { email, password } = userDetails;

    // Try to find a user with the given username
    const user = await this.userRepository.findOneBy({ email });
    if (user?.password !== password) {
        throw new UnauthorizedException();
      }
    const payload = { sub: user.email, email: user.email };
    return {
    access_token: await this.jwtService.signAsync(payload),
    };
  }
}
