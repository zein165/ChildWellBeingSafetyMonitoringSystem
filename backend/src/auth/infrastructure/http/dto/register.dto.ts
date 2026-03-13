import { IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { User, UserRole } from 'src/auth/domain/user.entity';

export class RegisterParentRequest {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}

export class RegisterChildRequest {
    @IsString()
    parentId: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;
}
