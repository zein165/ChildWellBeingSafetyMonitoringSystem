export interface LocationPersistence {
    id: string;
    childId: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
}

export class Location {
    private constructor(
        private readonly id: string,
        private readonly childId: string,
        private readonly latitude: number,
        private readonly longitude: number,
        private readonly createdAt?: Date,
    ) {}

    static create(
        id: string,
        childId: string,
        latitude: number,
        longitude: number,
    ): Location {
        return new Location(id, childId, latitude, longitude);
    }

    static fromPersistence(persistence: LocationPersistence): Location {
        return new Location(
            persistence.id,
            persistence.childId,
            persistence.latitude,
            persistence.longitude,
            persistence.createdAt,
        );
    }

    getId(): string {
        return this.id;
    }

    getChildId(): string {
        return this.childId;
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
}
