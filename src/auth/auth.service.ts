import { Response, Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  email: string;
  sub: number;
  tokenId?: string;
  revoked?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const userWithoutPassword = { ...user, password: undefined };
      return userWithoutPassword;
    }
    return null;
  }

  async login(user: any, res: Response) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshTokenEntry = await this.prisma.client.refreshToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, tokenId: refreshTokenEntry.id },
      { expiresIn: '7d' },
    );

    res.cookie('auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException(err, 'Invalid refresh token');
    }

    const now = new Date();

    await this.prisma.client.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    const storedToken = await this.prisma.client.refreshToken.findUnique({
      where: { id: payload.tokenId },
    });

    if (!storedToken || storedToken.revoked) {
      throw new UnauthorizedException('Refresh token is invalid or revoked');
    }

    await this.prisma.client.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const newToken = await this.prisma.client.refreshToken.create({
      data: {
        userId: payload.sub,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    });

    const newRefreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, tokenId: newToken.id },
      { expiresIn: '7d' },
    );

    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, tokenId: newToken.id },
      { expiresIn: '15m' },
    );

    res.cookie('auth-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Token refreshed successfully' };
  }

  async getCurrentUser(req: Request) {
    const authToken = req.cookies['auth-token'];
    if (!authToken) {
      throw new UnauthorizedException('Access token is required');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(authToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid access token', err);
    }

    const user = await this.userService.getUserById({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      // admin: user.admin,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token'];
    res.clearCookie('auth-token');
    res.clearCookie('refresh-token');

    if (refreshToken) {
      try {
        const payload = this.jwtService.verify(refreshToken);
        await this.prisma.client.refreshToken.update({
          where: { id: payload.tokenId },
          data: { revoked: true },
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
}
