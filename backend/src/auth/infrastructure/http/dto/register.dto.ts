import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterParentRequest {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class RegisterChildRequest {
    @IsString()
    parentId: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    pin: string;
}
