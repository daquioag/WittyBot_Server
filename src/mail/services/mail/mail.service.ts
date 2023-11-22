// mail/services/mail/mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // replace with your email
        pass: 'your_email_password', // replace with your email password or use an app-specific password
      },
    });
  }

  sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const mailOptions = {
      from: 'your_email@gmail.com', // replace with your email
      to,
      subject: 'Password Reset Link',
      text: `Click the following link to reset your password: https://yourdomain.com/reset-password?token=${resetToken}`,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve();
        }
      });
    });
  }
}
