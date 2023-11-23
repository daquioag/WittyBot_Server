import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginUserParams, ForgotPasswordParams } from '../../types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/services/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';
import * as nodemailer from 'nodemailer';


@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userDetails: LoginUserParams) {
    const { email, password } = userDetails;
    const userDB = await this.userService.findUserByEmail(email);

    if (userDB) {
      const matched = comparePasswords(password, userDB.password);
      if (matched) {
        console.log('USER FOUND!');
        const payload = {
          sub: userDB.id,
          email: userDB.email,
          username: userDB.username,
          apiCalls: userDB.apicalls,
          admin: userDB.admin,
        };
        const token = await this.jwtService.signAsync(payload);
        
        return token;
      } else {
        console.log('Wrong password!');
        throw new UnauthorizedException();
      }
    }
    console.log('User not found!');
    throw new NotFoundException();
  }

  async sendEmailLink(userEmail: ForgotPasswordParams) {
    const { email } = userEmail;
    const userDB = await this.userService.findUserByEmail(email);

    if (userDB) {
      const payload = { id: userDB.id, email: userDB.email };
      const resetToken = await this.jwtService.signAsync(payload);
      // const baseUrl = 'https://comp4537.com/witty/client/HTML/reset-password.html';
      const baseUrl = 'http://localhost:5500/Client/HTML/reset-password.html';
      const resetLink = `${baseUrl}?token=${resetToken}`;
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // replace with your email
          pass: process.env.APP_PASS, // replace with your email password
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER, // replace with your "from" email
        to: userDB.email, // replace with the recipient's email
        subject: 'Password Reset Link',
        html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">Reset My Password</a>
      `,      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return resetToken; // Return the reset link
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
      }
    } else {
      console.log('User not found!');
      throw new NotFoundException();
    }
  }
}
