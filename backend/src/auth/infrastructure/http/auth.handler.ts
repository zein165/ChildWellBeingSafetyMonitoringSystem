import { Body, Controller, Post } from '@nestjs/common';
import { AuthUsecase } from 'src/auth/application/auth.usecase';
import { LoginDto } from 'src/auth/application/dto/login.dto';
import { RegisterDto } from 'src/auth/application/dto/register.dto';

@Controller('auth')
export class AuthHandler {
    constructor(private readonly authService: AuthUsecase) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }
}