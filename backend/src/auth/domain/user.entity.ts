import { DomainError } from 'src/common/errors/domain.error';
import { UserErrorCode } from './user-error-code.enum';

export interface UserPersistence {
    id: string;
    username: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum UserRole {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
}

export class User {
    private constructor(
        private readonly id: string,
        private readonly username: string,
        private readonly password: string,
        private readonly role: UserRole,
        private createdAt?: Date,
        private updatedAt?: Date,
    ) {}

    static createParent(
        id: string,
        username: string,
        passwordHash: string,
    ): User {
        this.validateUsername(username);
        return new User(id, username, passwordHash, UserRole.PARENT);
    }

    static fromPersistence(raw: UserPersistence): User {
        return new User(
            raw.id,
            raw.username,
            raw.password,
            raw.role as UserRole,
            raw.createdAt,
            raw.updatedAt,
        );
    }

    private static validateUsername(username: string): void {
        if(!username || username.length < 3) {
            throw new DomainError(
                UserErrorCode.INVALID_USERNAME,
                'Username must be at least 3 characters',
            );
        }
    }

    getId(): string {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getHashedPassword(): string {
        return this.password;
    }

    getRole(): UserRole {
        return this.role;
    }
}