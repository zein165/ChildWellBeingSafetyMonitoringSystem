import { ApplicationStatus } from '../../domain/application.entity';

export interface GetChildApplicationsInput {
    childId: string;
}

export interface ApplicationDTO {
    id: string;
    childId: string;
    packageName: string;
    name: string;
    status: ApplicationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetChildApplicationsOutput {
    childId: string;
    applications: ApplicationDTO[];
}