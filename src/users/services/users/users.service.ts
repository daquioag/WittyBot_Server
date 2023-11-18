import { Injectable, NotFoundException, UnauthorizedException, ConflictException   } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/';
import { encodePassword } from 'src/utils/bcrypt';
import { CreateUserParams, DeleteUserParams, LoginUserParams } from '../../types';
// service class is responsible for all business logic
// like calling APIs
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userDetails: CreateUserParams) {
    const password = encodePassword(userDetails.password);
    const { email } = userDetails;
    const emailDB = await this.userRepository.findOneBy({ email });

    if (emailDB) {
      throw new ConflictException ();
    }

    const newUser = this.userRepository.create({
      ...userDetails, password, 
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user){
      throw new NotFoundException('User not found');
    }
    return user
  }

  findUsers(){
    return this.userRepository.find();
  }

  async deleteUser(id : DeleteUserParams) {
    const user = await this.userRepository.findOneBy( id );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }

  async createDefaultUser(): Promise<void> {
    const defaultEmail = "admin@admin.com";
    const existingAdmin = await this.userRepository.findOne({ where: { email: defaultEmail } });
  
    // If an admin user already exists, no need to create a new one
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }
  
    // Create the admin user
    this.createUser({
      username: 'admin',
      email: defaultEmail,
      password: 'admin',
      admin: true,
    });
  }
  
}
