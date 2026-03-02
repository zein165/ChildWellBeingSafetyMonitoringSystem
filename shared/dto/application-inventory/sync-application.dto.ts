import {ApplicationStatus} from "../../enums/application-inventory/application-status.enum";
import {ApplicationCategory} from "../../enums/application-inventory/application-category.enum";

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
        detail: {
            packageName: string;
            title: string;
            description: string;
            developer: string;
            genre: string;
            categories: ApplicationCategory[];
        };
        createdAt: Date;
        updatedAt: Date;
    }
}