import { IsNotEmpty, IsString } from 'class-validator';

export class HeartbeatDto {
    @IsString()
    @IsNotEmpty()
    childId!: string;
}