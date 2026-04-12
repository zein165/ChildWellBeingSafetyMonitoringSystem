import { User, UserRole } from 'src/auth/domain/user.entity';

export class RegisterParentInput {
    username: string;
    password: string;
}

export class RegisterUserOutput {
    id: string;
    username: string;
    role: UserRole;

    private constructor(id: string, username: string, role: UserRole) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    static create(user: User): RegisterUserOutput {
        return new RegisterUserOutput(user.getId(), user.getUsername(), user.getRole());
    }
}

export class RegisterChildInput {
    parentId: string;
    username: string;
    pin: string;
}

export class RegisterChildOutput {
    id: string;
    username: string;
    role: UserRole;
    parentId: string;

    private constructor(
        id: string,
        username: string,
        role: UserRole,
        parentId: string,
    ) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.parentId = parentId;
    }

    static create(user: User): RegisterChildOutput {
        return new RegisterChildOutput(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getParentId()!,
        );
    }
}