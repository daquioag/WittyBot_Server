import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../../typeorm/';
import { encodePassword } from 'src/utils/bcrypt';
import {
  CreateUserParams,
  DeleteUserParams,
  updateUserParams,
} from '../../types';
import * as strings from '../../../utils/strings';

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
      throw new ConflictException();
    }

    const newUser = this.userRepository.create({
      ...userDetails,
      password,
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(strings.USER_NOT_FOUND);
    }
    return user;
  }

  async fetchUserById(id: number) {
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException(strings.USER_NOT_FOUND);
    }
    return user;
  }
  
  findUsers() {
    return this.userRepository.find();
  }

  async deleteUser(id: DeleteUserParams) {
    const user = await this.userRepository.findOneBy(id);

    if (!user) {
      throw new NotFoundException(strings.USER_NOT_FOUND);
    }

    return this.userRepository.remove(user);
  }

  async createDefaultUser(): Promise<void> {
    const defaultEmail = strings.DEFAULT_ADMIN_EMAIL;
    const existingAdmin = await this.userRepository.findOne({
      where: { email: defaultEmail },
    });

    if (existingAdmin) {
      return;
    }

    // Create the admin user
    this.createUser({
      username: strings.ADMIN,
      email: defaultEmail,
      password: strings.ADMIN,
      admin: true,
    });
  }

  async resetPassword(id, newPassword: string): Promise<UpdateResult> {
    const password = encodePassword(newPassword);

    try {
      const patchedUser = await this.userRepository.update(
        { id },
        { password },
      );

      console.log(strings.PASSWORD_UPDATED_SUCCESSFULLY, patchedUser);

      return patchedUser;
    } catch (error) {
      console.error(strings.ERROR_CHANGING_PASSWORD, error.message);
      throw error; // Rethrow the error to propagate it to the caller if needed
    }
  }

  async updateUser(id, updateUserDetails: updateUserParams) {
    const userDB = await this.userRepository.findOneBy({ id });

    if (!userDB) {
      throw new NotFoundException();
    }

    const userWithSameEmail = await this.userRepository.findOneBy({ email: updateUserDetails.email });
    if (userWithSameEmail && userWithSameEmail.id !== id) {
      // 'Email is already in use by another user.'
      throw new ConflictException();
  }
    const patchedUser = await this.userRepository.update(id, updateUserDetails);
    return patchedUser;
  }

  async incrementApiCount(email): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (user) {
        user.apiCalls += 1; // Increment the API count
        await this.userRepository.save(user);
      } else {
        console.error(strings.USER_NOT_FOUND_BY_EMAIL(email));
      }
    } catch (error) {
      console.error(strings.ERROR_INCREMENTING_API_COUNT(email), error.message);
    }
  }

}
