import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../../domain/user.repository';
import { User, UserRole } from 'src/auth/domain/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { username } });

        if (!user) return null;

        return User.fromPersistence({
            id: user.id,
            username: user.username,
            password: user.password,
            role: user.role as unknown as UserRole,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }

    async create(user: User): Promise<User> {
        const createdUser = await this.prisma.user.create({
            data: {
                id: user.getId,
                username: user.getUsername,
                password: user.getPassword,
                role: user.getRole as any,
            },
        });

        return User.fromPersistence({createdUser})
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) return null;

        return User.fromPersistence({
            id: user.id,
            username: user.username,
            password: user.password,
            role: user.role as unknown as UserRole,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}