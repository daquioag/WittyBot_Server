import { Controller, Get, Res, HttpStatus, HttpCode, Req } from '@nestjs/common';
import { RequestService } from '../../services/request/request.service';
import { Response, Request } from 'express';
import { User } from 'src/users/types';
import { UsersService } from 'src/users/services/users/users.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import * as strings from '../../../utils/strings';

@ApiTags('Stats')
@Controller('stats')
export class RequestController {
  constructor(private readonly requestService: RequestService, private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        stats: [
          {
            id: 1,
            method: 'GET',
            endpoint: '/getStats',
            request_count: 100,
            last_served_at: '2023-01-01T12:00:00Z',
            description: 'Gets api call statistics',
          },
          // Add more examples if needed
        ],
      },
    },
  })
  @ApiOperation({ summary: 'Get API statistics' })
  @Get('getStats')
  async getStats() {
    try {
      const stats = await this.requestService.getStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: 'Error fetching statistics' };
    }
  }

  @ApiOperation({ summary: 'Increment API count for getJoke' })
  @ApiResponse({
    status: 200,
    description: strings.API_COUNT_INCREMENTED_JOKE,
    schema: {
      example: {
        message: strings.API_COUNT_INCREMENTED_JOKE,
      },
    },
  })
  @Get('incrementFetchJoke')
  @HttpCode(HttpStatus.OK)
  async incrementFetchJoke(@Res() res: Response, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    if (user) {
      await this.userService.incrementApiCount(user.email);
    }
    await this.requestService.incrementRequestCount('POST', '/getJoke');
    res.status(HttpStatus.OK).send({ message: strings.API_COUNT_INCREMENTED_HEALTH_TIP });

  }

  @ApiOperation({ summary: 'Increment API count for GetHealthTip' })
  @ApiResponse({
    status: 200,
    description: strings.API_COUNT_INCREMENTED_HEALTH_TIP,
    schema: {
      example: {
        message: strings.API_COUNT_INCREMENTED_HEALTH_TIP,
      },
    },
  })
  @Get('incrementGetHealthTip')
  @HttpCode(HttpStatus.OK)
  async incrementGetHealthTip(@Res() res: Response, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    if (user) {
      await this.userService.incrementApiCount(user.email);
    }
    await this.requestService.incrementRequestCount('POST', '/getHealthTip');
    res.status(HttpStatus.OK).send({ message: strings.API_COUNT_INCREMENTED_HEALTH_TIP });
  }
}
