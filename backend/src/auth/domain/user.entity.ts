import { DomainError } from 'src/common/errors/domain.error';
import { UserErrorCode } from './user-error-code.enum';

export interface UserPersistence {
    id: string;
    username: string;
    password: string;
    role: string;
    parentId?: string;
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
        private readonly parentId?: string,
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

    static createChild(
        id: string,
        username: string,
        pinHash: string,
        parentId: string,
    ): User {
        this.validateUsername(username);

        if (!parentId) {
            throw new DomainError(
                UserErrorCode.INVALID_PARENT,
                'Child must belong to a parent',
            );
        }

        return new User(
            id,
            username,
            pinHash,
            UserRole.CHILD,
            parentId,
        )
    }

    static fromPersistence(raw: UserPersistence): User {
        return new User(
            raw.id,
            raw.username,
            raw.password,
            raw.role as UserRole,
            raw.parentId,
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

    getParentId(): string | undefined {
        return this.parentId;
    }

    getParentIdOrThrow(): string {
        if (!this.parentId) {
            throw new DomainError(
                UserErrorCode.INVALID_PARENT,
                'ParentId not found',
            );
        }

        return this.parentId;
    }

    isChild(): boolean {
        return this.role === UserRole.CHILD;
    }

    isParent(): boolean {
        return this.role === UserRole.PARENT;
    }
}