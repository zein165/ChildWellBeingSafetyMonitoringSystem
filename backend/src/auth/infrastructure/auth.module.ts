import { JwtModule } from "@nestjs/jwt";
import { AuthUsecase } from "../application/auth.usecase";
import { AuthHandler } from "./http/auth.handler";
import { PrismaUserRepository } from "./persistence/prisma-user.repository";
import { Module } from "@nestjs/common";
import { UuidIdGenerator } from './security/uuid-id.generator';
import { JwtTokenService } from './security/jwt-token-service';
import { BcryptPasswordHasher } from './security/bcrypt-password.hasher';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    providers: [
        AuthUsecase,
        {
            provide: 'UserRepository',
            useClass: PrismaUserRepository,
        },
        {
            provide: 'IdGenerator',
            useClass: UuidIdGenerator,
        },
        {
            provide: 'TokenService',
            useClass: JwtTokenService,
        },
        {
            provide: 'PasswordHasher',
            useClass: BcryptPasswordHasher,
        },
    ],
    controllers: [AuthHandler],
})
export class AuthModule {}