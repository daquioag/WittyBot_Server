import { Injectable, NotFoundException, UnauthorizedException, ConflictException   } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/';
import { CreateUserParams, LoginUserParams } from '../../types';
// service class is responsible for all business logic
// like calling APIs
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async loginUser(userDetails: LoginUserParams) {
    const { email, password } = userDetails;

    // Try to find a user with the given username
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }
    
    return user;
  }

  async createUser(userDetails: CreateUserParams) {
    const {  email } = userDetails;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException ('User with this email already exists');
    }

    const newUser = this.userRepository.create({
      ...userDetails,
    });
    const savedUser = await this.userRepository.save(newUser);
    console.log(savedUser); // This will include any database-generated values, like ID
    return savedUser;
  }
}
