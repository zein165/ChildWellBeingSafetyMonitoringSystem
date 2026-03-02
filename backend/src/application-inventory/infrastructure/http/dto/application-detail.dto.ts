import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationDetailRequest {
    @IsString()
    @IsNotEmpty()
    packageName: string;
}