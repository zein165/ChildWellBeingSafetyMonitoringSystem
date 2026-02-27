import {ApplicationStatus} from "../../enums/application-inventory/application-status.enum";

export interface SyncApplicationRequest {
    childId: string;
    applications: {
        packageName: string,
        name: string,
        versionName: string,
        versionCode: number,
        status: ApplicationStatus
    }[];
}

export interface SyncApplicationResponse {
    childId: string;
    applications: {
        packageName: string;
        name: string;
        versionName: string;
        versionCode: number;
        status: ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
    }
}