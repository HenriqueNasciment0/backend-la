import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    await this.authService.login(req.user, res);
    return res.status(200).json({ message: 'Login successful', status: 200 });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    return this.authService.getCurrentUser(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    await this.authService.refreshToken(req, res);
    return res
      .status(200)
      .json({ message: 'Token refreshed successfully', status: 200 });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('register')
  async register(@Body() body: any) {
    const { name, email, password } = body;
    const hashedPassword = await this.authService.hashPassword(password);
    return this.userService.createUser({
      email,
      name,
      password: hashedPassword,
    });
  }
}
