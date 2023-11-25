// request-logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from 'src/request/services/request/request.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const endpoint = req.originalUrl.replace(/\/users\/\d+/, '/users/:id');
    this.requestService.incrementRequestCount(method, endpoint);
    next();
  }
}
