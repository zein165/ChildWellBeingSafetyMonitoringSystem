import { UserRole } from "../enums/user-role.enum";

export interface UserModel{
    id: string;
    email?: string;
    role: UserRole;
    parentId?: string | null;
    createdAt: Date;
}