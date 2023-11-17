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
    const {  username, email } = userDetails;
    const userDB = await this.userRepository.findOneBy({ username });
    const emailDB = await this.userRepository.findOneBy({ email });

    if (userDB || emailDB) {
      throw new ConflictException ();
    }

    const newUser = this.userRepository.create({
      ...userDetails, password
    });
    const savedUser = await this.userRepository.save(newUser);
    console.log(savedUser); // This will include any database-generated values, like ID
    return savedUser;
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user){
      throw new NotFoundException('User not found');
    }
    return user
  }

  findUsers(){
    return this.userRepository.find();
  }

  async deleteUser(id : DeleteUserParams) {
    console.log("HELO123")
    console.log(id)
    console.log(typeof id);
    const user = await this.userRepository.findOneBy( id );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }

}
