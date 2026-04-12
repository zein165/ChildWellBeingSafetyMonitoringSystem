import {
    ApplicationStatus,
} from '../../domain/application.entity';
import { ApplicationDetail } from '../../domain/application-detail.entity';

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
    applications: {
        id: string;
        childId: string;
        packageName: string;
        name: string;
        status: ApplicationStatus;
        detail: ApplicationDetail | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
}