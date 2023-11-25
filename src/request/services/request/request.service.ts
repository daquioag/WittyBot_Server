import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, UpdateResult } from 'typeorm';
  import { RequestTracking } from '../../../typeorm/';


@Injectable()
export class RequestService{  
    constructor(@InjectRepository(RequestTracking) private readonly requestRepository: Repository<RequestTracking>) {}

    async insertInitialData(): Promise<void> {
        const initialData = [
          { method: 'POST', endpoint: '/create', request_count: 0, description: 'Registers a new user' },
          { method: 'POST', endpoint: '/login', request_count: 0, description: 'Logs in a user' },
          { method: 'POST', endpoint: 'users/create', request_count: 0, description: 'Creates a new user' },
          { method: 'POST', endpoint: 'auth/forgot-password', request_count: 0, description: 'Initiates password reset' },
          { method: 'POST', endpoint: 'users/reset-password', request_count: 0, description: 'Resets user password' },
          { method: 'GET', endpoint: '/logout', request_count: 0, description: 'Logs out a user' },
          { method: 'GET', endpoint: 'users/getUsers', request_count: 0, description: 'Gets a list of users' },
          { method: 'GET', endpoint: 'users/getRole', request_count: 0, description: 'Gets user roles' },
          { method: 'GET', endpoint: 'users/:id', request_count: 0, description: 'Gets user details by ID' },
          { method: 'GET', endpoint: 'users/getUsers', request_count: 0, description: 'Gets a list of users' },
          { method: 'GET', endpoint: 'auth/profile', request_count: 0, description: 'Gets user profile' },
          { method: 'GET', endpoint: 'report/getStats', request_count: 0, description: 'Deletes a user' },

          { method: 'PATCH', endpoint: 'users/:id', request_count: 0, description: 'Updates user details by ID' },
          { method: 'DELETE', endpoint: 'users/delete', request_count: 0, description: 'Deletes a user' },

        ];
      
        for (const data of initialData) {
          const existingRecord = await this.requestRepository.findOne({
            where: { method: data.method, endpoint: data.endpoint },
          });
      
          if (!existingRecord) {
            await this.requestRepository.save(this.requestRepository.create(data));
          }
        }
      }
      
      
    }

