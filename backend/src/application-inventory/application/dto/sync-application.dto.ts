import {
    ApplicationStatus,
} from '../../domain/application.entity';
import { ApplicationDTO } from './get-child-application.dto';

export interface SyncApplicationInput {
    childId: string;
    applications: {
        packageName: string;
        name: string;
        status: ApplicationStatus;
    }[];
}

export interface SyncApplicationOutput {
    childId: string;
    applications: ApplicationDTO[];
}