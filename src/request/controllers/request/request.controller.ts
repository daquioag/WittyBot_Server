import { Controller, Get } from '@nestjs/common';
import { RequestService } from '../../services/request/request.service';

@Controller('stats')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  async getStats() {
    try {
      const stats = await this.requestService.getStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: 'Error fetching statistics' };
    }
  }

  @Get('incrementFetchJoke')
  async incrementFetchJoke(): Promise<void> {
    // Assuming 'POST' method and '/getJoke' endpoint for demonstration
    await this.requestService.incrementRequestCount('POST', '/getJoke');
  }

  @Get('incrementGetHealthTip')
  async incrementGetHealthTip(): Promise<void> {
    // Assuming 'POST' method and '/getJoke' endpoint for demonstration
    await this.requestService.incrementRequestCount('POST', '/GetHealthTip');
  }
}
