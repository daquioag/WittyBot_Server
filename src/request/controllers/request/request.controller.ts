import { Controller, Get, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { RequestService } from '../../services/request/request.service';
import { Response } from 'express';

@Controller('stats')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('getStats')
  async getStats() {
    try {
      const stats = await this.requestService.getStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: 'Error fetching statistics' };
    }
  }

  @Get('incrementFetchJoke')
  @HttpCode(HttpStatus.OK)
  async incrementFetchJoke(@Res({ passthrough: true }) res: Response): Promise<void> {
    await this.requestService.incrementRequestCount('POST', '/getJoke');
    res.status(HttpStatus.OK).send({ message: 'API count incremented for getJoke!' });

  }

  @Get('incrementGetHealthTip')
  async incrementGetHealthTip(@Res() res: Response): Promise<void> {
    await this.requestService.incrementRequestCount('POST', '/getHealthTip');
    res.status(HttpStatus.OK).send({ message: 'API count incremented for GetHealthTip!' });

  }
}
