import { Application } from './application.entity';

export interface ApplicationRepository {
    getByChildId(id: string): Promise<Application[]>;
    saveMany(applications: Application[]): Promise<Application[]>;
}