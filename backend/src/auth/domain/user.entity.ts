import { AppError } from "src/common/errors/app.error";
import { v4 as uuidv4 } from "uuid";

export enum UserRole {
    PARENT = 'PARENT',
    CHILD = 'CHILD',
}

export class User {
    private constructor (
        private readonly id: string,
        private readonly username: string,
        private readonly password: string,
        private readonly role: UserRole,
        private createdAt?: Date,
        private updatedAt?: Date,
    ) {}

    static createParent(
        username: string, 
        passwordHash: string, 
    ): User {
        if (username.length < 3) throw new AppError('Username must not be less than 3 characters', 400);

        return new User(
            uuidv4(),
            username,
            passwordHash,
            UserRole.PARENT
        )
    }

    static fromPersistence(
        raw: any
    ): User {
        return new User(
            raw.id,
            raw.username,
            raw.password,
            raw.role as UserRole,
            raw.createdAt,
            raw.updatedAt
        );
    }

    get getId(){
        return this.id
    }

    get getUsername(): string {
        return this.username;
    }

    get getPassword(): string {
        return this.password;
    }

    get getRole(): string {
        return this.role;
    }
}