import { ApplicationCategory } from '../../domain/application-detail.entity';

export interface ApplicationDetailInput {
    packageName: string;
}

export interface ApplicationDetailOutput {
    packageName: string;
    title: string;
    description: string;
    developer: string;
    genre: string;
    categories: ApplicationCategory[];
}