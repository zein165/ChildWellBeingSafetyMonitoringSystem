import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ApplicationStatus } from '../../../domain/application.entity';
import { Type } from 'class-transformer';

class ApplicationItemRequest {
    @IsString()
    @IsNotEmpty()
    packageName: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    versionName: string;

    @IsNumber()
    versionCode: number;

    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;
}

export class RegisterApplicationRequest {
    @IsString()
    @IsNotEmpty()
    childId: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ApplicationItemRequest)
    applications: ApplicationItemRequest[];
}