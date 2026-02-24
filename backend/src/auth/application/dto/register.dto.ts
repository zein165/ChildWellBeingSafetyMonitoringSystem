import { IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from 'src/auth/domain/user.entity';

export class RegisterDto {
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