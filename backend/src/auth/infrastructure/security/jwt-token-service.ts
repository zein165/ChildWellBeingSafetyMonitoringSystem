import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
    TokenPayload,
    TokenService,
} from '../../application/token-service.interface';

@Injectable()
export class JwtTokenService implements TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAccessToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
    }

    async generateRefreshToken(payload: TokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        return this.jwtService.verifyAsync(token);
    }
}