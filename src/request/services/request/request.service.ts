import {
    Injectable,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { RequestTracking } from '../../../typeorm/';
  import * as strings from '../../../utils/strings';

@Injectable()
export class RequestService{  
    constructor(@InjectRepository(RequestTracking) private readonly requestRepository: Repository<RequestTracking>) {}

    async getStats(): Promise<RequestTracking[]> {
      return await this.requestRepository.find();
    }


    async insertInitialData(): Promise<void> {
      const initialData = [
        { method: 'POST', endpoint: '/users/create', request_count: 0, description: 'Creates a new user' },
        { method: 'POST', endpoint: '/auth/forgot-password', request_count: 0, description: 'Initiates password reset' },
        { method: 'POST', endpoint: '/users/reset-password', request_count: 0, description: 'Resets user password' },
        { method: 'POST', endpoint: '/getJoke', request_count: 0, description: 'Gets a joke' },
        { method: 'POST', endpoint: '/getHealthTip', request_count: 0, description: 'Gets a health tip' },
        { method: 'POST', endpoint: '/auth/login', request_count: 0, description: 'Logs in a user' },

        { method: 'GET', endpoint: '/auth/logout', request_count: 0, description: 'Logs out a user' },
        { method: 'GET', endpoint: '/users/getUsers', request_count: 0, description: 'Gets a list of users' },
        { method: 'GET', endpoint: '/users/getInfo', request_count: 0, description: 'Gets user info' },
        { method: 'GET', endpoint: '/users/:id', request_count: 0, description: 'Gets user details by ID' },
        { method: 'GET', endpoint: '/auth/profile', request_count: 0, description: 'Gets user profile' },
        { method: 'GET', endpoint: '/stats/getStats', request_count: 0, description: 'Gets api call statistics' },
    
        { method: 'PATCH', endpoint: '/users/:id', request_count: 0, description: 'Updates user details by ID' },
        { method: 'DELETE', endpoint: '/users/delete', request_count: 0, description: 'Deletes a user' },
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
      
      async incrementRequestCount(method: string, endpoint: string): Promise<void> {
        const existingRecord = await this.requestRepository.findOne({
          where: { method, endpoint },
        });
        if (existingRecord) {
          existingRecord.request_count += 1;
          existingRecord.last_served_at = new Date(); // Update the lastServedAt to the current date and time
          await this.requestRepository.save(existingRecord);
        } else {
          // If the record doesn't exist, you may want to handle this case accordingly.
          console.log(strings.RECORD_NOT_FOUND(method, endpoint));

        }
      }
            
    }

