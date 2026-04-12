import { ApplicationDetail } from './application-detail.entity';

export interface ApplicationPersistence {
    id: string;
    childId: string;
    packageName: string;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum ApplicationStatus {
    INSTALLED = 'INSTALLED',
    REMOVED = 'REMOVED',
}

export class Application {
    private constructor(
        private readonly id: string,
        private readonly childId: string,
        private readonly packageName: string,
        private readonly name: string,
        private readonly status: ApplicationStatus,
        private detail: ApplicationDetail | null,
        private createdAt?: Date,
        private updatedAt?: Date,
    ) {}

    static create(id: string, childId: string, packageName: string, name: string, status: ApplicationStatus, detail: ApplicationDetail | null): Application {
        return new Application(
            id,
            childId,
            packageName,
            name,
            status,
            detail,
        );
    }

    static fromPersistence(persistence: ApplicationPersistence): Application {
        return new Application(
            persistence.id,
            persistence.childId,
            persistence.packageName,
            persistence.name,
            persistence.status as ApplicationStatus,
            null,
            persistence.createdAt,
            persistence.updatedAt,
        )
    }

    getId(): string {
        return this.id;
    }

    getChildId(): string {
        return this.childId;
    }

    getPackageName(): string {
        return this.packageName;
    }

    getName(): string {
        return this.name;
    }

    getStatus(): ApplicationStatus {
        return this.status;
    }

    getDetail(): ApplicationDetail | null {
        return this.detail;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }

    setDetail(detail: ApplicationDetail | null): void {
        this.detail = detail;
    }
}