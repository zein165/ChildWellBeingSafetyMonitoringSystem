import { Application } from '../../domain/application.entity';

export interface GetChildApplicationsInput {
    childId: string;
}

export interface GetChildApplicationsOutput {
    childId: string;
    applications: Application[];
}