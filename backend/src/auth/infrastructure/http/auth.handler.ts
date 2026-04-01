import { Body, Controller, Post } from '@nestjs/common';
import { AuthUsecase } from 'src/auth/application/auth.usecase';
import { RegisterParentRequest, RegisterChildRequest } from './dto/register.dto';
import { ApiResponse } from '../../../common/http/response.helper';
import { LoginRequest } from './dto/login.dto';

@Controller('auth')
export class AuthHandler {
    constructor(private readonly authService: AuthUsecase) {}

    @Post('register/parent')
    async registerParent(@Body() body: RegisterParentRequest) {
        const user = await this.authService.registerParent(body);
        return ApiResponse.success('A new parent successfully created', user);
    }

    @Post('register/child')
    async registerChild(@Body() body: RegisterChildRequest) {
        const user = await this.authService.registerChild(body);
        return ApiResponse.success('A new child successfully created', user);
    }

    @Post('login')
    async login(@Body() body: LoginRequest) {
      const auth = await this.authService.login(body);
      return ApiResponse.success('Authenticated successfully', auth);
    }
}