import { AppChangeAction } from '../../enums/app-change-action.enum';

export interface AppChangeEventDto {
    packageName: string;
    appName: string;
    action: AppChangeAction;
    timestamp: string;
}