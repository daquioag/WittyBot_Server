import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../../services/mail/mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}
  
    @Post('send-password-reset')
    async sendPasswordResetEmail(@Body() body: { email: string, resetToken: string }): Promise<void> {
      const { email, resetToken } = body;
      await this.mailService.sendPasswordResetEmail(email, resetToken);
    }
  }