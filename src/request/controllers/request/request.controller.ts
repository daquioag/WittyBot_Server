import { Controller, Get, Res, HttpStatus, HttpCode, Req } from '@nestjs/common';
import { RequestService } from '../../services/request/request.service';
import { Response, Request } from 'express';
import { User } from 'src/users/types';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('stats')
export class RequestController {
  constructor(private readonly requestService: RequestService, private readonly userService: UsersService) {}

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
  async incrementFetchJoke(@Res() res: Response, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    if (user) {
      await this.userService.incrementApiCount(user.email);
    }
    await this.requestService.incrementRequestCount('POST', '/getJoke');
    res.status(HttpStatus.OK).send({ message: 'API count incremented for getJoke!' });

  }

  @Get('incrementGetHealthTip')
  @HttpCode(HttpStatus.OK)
  async incrementGetHealthTip(@Res() res: Response, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    if (user) {
      await this.userService.incrementApiCount(user.email);
    }
    await this.requestService.incrementRequestCount('POST', '/getHealthTip');
    res.status(HttpStatus.OK).send({ message: 'API count incremented for GetHealthTip!' });
  }
}
