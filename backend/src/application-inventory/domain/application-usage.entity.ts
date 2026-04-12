export interface ApplicationUsagePersistence {
    id: string;
    applicationId: string;
    date: Date;
    duration: bigint;
    createdAt: Date;
    updatedAt: Date;
}

export class ApplicationUsage {
    private constructor(
        private readonly id: string,
        private readonly applicationId: string,
        private readonly date: Date,
        private readonly duration: bigint,
        private readonly createdAt?: Date,
        private readonly updatedAt?: Date,
    ) {}

    static create(
        id: string,
        applicationId: string,
        date: Date,
        duration: bigint,
    ): ApplicationUsage {
        return new ApplicationUsage(id, applicationId, date, duration);
    }

    static fromPersistence(persistence: ApplicationUsagePersistence): ApplicationUsage {
        return new ApplicationUsage(
            persistence.id,
            persistence.applicationId,
            persistence.date,
            persistence.duration,
            persistence.createdAt,
            persistence.updatedAt,
        );
    }

    getId(): string {
        return this.id;
    }

    getApplicationId(): string {
        return this.applicationId;
    }

    getDate(): Date {
        return this.date;
    }

    getDuration(): bigint {
        return this.duration;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}
