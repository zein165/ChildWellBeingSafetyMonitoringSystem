export interface ApplicationCategory {
    id: string | null;
    name: string;
}

export class ApplicationDetail {
    private constructor(
        private readonly packageName: string,
        private readonly title: string,
        private readonly description: string,
        private readonly developer: string,
        private readonly genre: string,
        private readonly categories: ApplicationCategory[],
    ) {}

    static create(
        packageName: string,
        title: string,
        description: string,
        developer: string,
        genre: string,
        categories: ApplicationCategory[],
    ): ApplicationDetail {
        return new ApplicationDetail(
            packageName,
            title,
            description,
            developer,
            genre,
            categories,
        );
    }

    getPackageName(): string {
        return this.packageName;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getDeveloper(): string {
        return this.developer;
    }

    getGenre(): string {
        return this.genre;
    }

    getCategories(): ApplicationCategory[] {
        return this.categories;
    }
}