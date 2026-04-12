import { Location } from './location.entity';

export interface LocationRepository {
    save(location: Location): Promise<void>;
    findLastByChildId(childId: string): Promise<Location | null>;
}
