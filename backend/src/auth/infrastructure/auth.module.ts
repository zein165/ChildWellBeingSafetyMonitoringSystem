import { JwtModule } from "@nestjs/jwt";
import { AuthUsecase } from "../application/auth.usecase";
import { AuthHandler } from "./http/auth.handler";
import { PrismaUserRepository } from "./persistence/prisma-user.repository";
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [
        JwtModule.register({
            secret: 'SECRET_KEY',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [
        AuthUsecase, 
        {
            provide: 'UserRepository', useClass: PrismaUserRepository
        }
    ],
    controllers: [AuthHandler],
})
export class AuthModule {}