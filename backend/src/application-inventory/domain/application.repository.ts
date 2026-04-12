import { Application } from './application.entity';
import { ApplicationUsage } from './application-usage.entity';

export interface ApplicationRepository {
    getByChildId(id: string): Promise<Application[]>;
    saveMany(applications: Application[]): Promise<Application[]>;
    syncApplications(childId: string, applications: Application[]): Promise<Application[]>;
    saveUsage(usages: ApplicationUsage[]): Promise<void>;
}