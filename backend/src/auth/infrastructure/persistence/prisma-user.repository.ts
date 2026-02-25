import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../../domain/user.repository';
import { User, UserRole } from 'src/auth/domain/user.entity';
import { DomainError } from '../../../common/errors/domain.error';
import { UserErrorCode } from '../../domain/user-error-code.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    private toDomainRole(role: string): UserRole {
        switch(role) {
            case 'PARENT':
                return UserRole.PARENT;
            case 'CHILD':
                return UserRole.CHILD;
            default:
                throw new DomainError(UserErrorCode.INVALID_ROLE, 'Invalid role');
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { username } });

        if (!user) return null;

        return User.fromPersistence({
            id: user.id,
            username: user.username,
            password: user.password,
            role: this.toDomainRole(user.role),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }

    async create(user: User): Promise<User> {
        const createdUser = await this.prisma.user.create({
            data: {
                id: user.getId(),
                username: user.getUsername(),
                password: user.getHashedPassword(),
                role: this.toDomainRole(user.getRole()),
            },
        });

        return User.fromPersistence(createdUser)
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) return null;

        return User.fromPersistence({
            id: user.id,
            username: user.username,
            password: user.password,
            role: this.toDomainRole(user.role),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    }
}