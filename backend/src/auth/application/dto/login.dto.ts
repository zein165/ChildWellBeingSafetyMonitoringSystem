import {UserRole} from "../../domain/user.entity";

export class LoginInput {
    username: string;
    password: string;
}

export class LoginOutput {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        role: UserRole;
    };

    private constructor(
        accessToken: string,
        refreshToken: string,
        user: { id: string; username: string; role: UserRole },
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    static create(
        accessToken: string,
        refreshToken: string,
        user: { id: string; username: string; role: UserRole },
    ): LoginOutput {
        return new LoginOutput(accessToken, refreshToken, user);
    }
}