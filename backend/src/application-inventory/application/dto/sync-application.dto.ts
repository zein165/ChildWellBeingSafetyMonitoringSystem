import {
    ApplicationStatus,
} from '../../domain/application.entity';

export interface SyncApplicationInput {
    childId: string;
    applications: {
        packageName: string;
        name: string;
        versionName: string;
        versionCode: number;
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
        versionName: string;
        versionCode: number;
        status: ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
    }[];
}