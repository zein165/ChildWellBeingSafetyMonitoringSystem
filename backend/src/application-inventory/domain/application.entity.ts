export interface ApplicationPersistence {
    id: string;
    childId: string;
    packageName: string;
    name: string;
    versionName: string;
    versionCode: number;
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
        private readonly versionName: string,
        private readonly versionCode: number,
        private readonly status: ApplicationStatus,
        private createdAt?: Date,
        private updatedAt?: Date,
    ) {}

    static create(id: string, childId: string, packageName: string, name: string, versionName: string, versionCode: number, status: ApplicationStatus): Application {
        return new Application(
            id,
            childId,
            packageName,
            name,
            versionName,
            versionCode,
            status
        );
    }

    static fromPersistence(persistence: ApplicationPersistence): Application {
        return new Application(
            persistence.id,
            persistence.childId,
            persistence.packageName,
            persistence.name,
            persistence.versionName,
            persistence.versionCode,
            persistence.status as ApplicationStatus,
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

    getVersionName(): string {
        return this.versionName;
    }

    getVersionCode(): number {
        return this.versionCode;
    }

    getStatus(): ApplicationStatus {
        return this.status;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}