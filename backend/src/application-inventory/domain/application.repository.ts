import { Application } from './application.entity';

export interface ApplicationRepository {
    saveMany(applications: Application[]): Promise<Application[]>;
}