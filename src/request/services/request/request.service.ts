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
          // ... (add other entries)
        ];
    
        for (const data of initialData) {
          await this.requestRepository.save(this.requestRepository.create(data));
        }
      }


      async createRequestTrackerWithParams(method: string, endpoint: string, requestCount: number, description: string): Promise<void> {
        const existingTracker = await this.requestRepository.findOne({
          where: { method, endpoint },
        });
      
        if (existingTracker) {
          console.log('Request tracker with the specified method and endpoint already exists.');
          return;
        }
      
        // Create the request tracker
        await this.requestRepository.save({ method, endpoint, requestCount, description });
      }
      
      // Example usage:
      async createDefaultRequestTracker(): Promise<void> {
        const defaultMethod = 'POST';
        const defaultEndpoint = '/login';
      
        // Check if the default request tracker already exists
        const existingTracker = await this.requestRepository.findOne({
          where: { method: defaultMethod, endpoint: defaultEndpoint },
        });
      
        if (existingTracker) {
          console.log('Request tracker already exists.');
          return;
        }
      
        // Create the default request tracker
        await this.createRequestTrackerWithParams(defaultMethod, defaultEndpoint, 0, 'Logs in a user');
      }
      
    }

