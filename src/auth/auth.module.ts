import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Certifique-se de importar o UserModule
import { AuthController } from './auth.controller'; // Verifique se o controller está importado
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, // Define o tempo de expiração do token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController], // O controller precisa estar aqui
  exports: [AuthService],
})
export class AuthModule {}
