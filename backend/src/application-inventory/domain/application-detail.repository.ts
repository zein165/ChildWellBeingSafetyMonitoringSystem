import { ApplicationDetail } from './application-detail.entity';

export interface ApplicationDetailRepository {
    getByPackageName(packageName: string): Promise<ApplicationDetail>
}