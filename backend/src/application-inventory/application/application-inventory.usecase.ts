import { Inject, Injectable } from '@nestjs/common';
import type { IdGenerator } from '../../common/interfaces/id-generator.interface';

import {
    SyncApplicationInput,
    SyncApplicationOutput,
} from './dto/sync-application.dto';

import type { UserRepository } from '../../auth/domain/user.repository';
import type { ApplicationRepository } from '../domain/application.repository';
import type { ApplicationDetailRepository } from '../domain/application-detail.repository';

import { Application } from '../domain/application.entity';
import { DomainError } from '../../common/errors/domain.error';
import { UserErrorCode } from '../../auth/domain/user-error-code.enum';
import { ApplicationErrorCode } from '../domain/application-error-code.enum';
import {
    ApplicationDetailInput,
    ApplicationDetailOutput,
} from './dto/application-detail.dto';

@Injectable()
export class ApplicationInventoryUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,

        @Inject('ApplicationRepository')
        private readonly applicationRepository: ApplicationRepository,

        @Inject('ApplicationDetailRepository')
        private readonly applicationDetailRepository: ApplicationDetailRepository,

        @Inject('IdGenerator')
        private readonly idGenerator: IdGenerator,
    ) {}

    async syncApplication(input: SyncApplicationInput): Promise<SyncApplicationOutput> {
        if(!input.applications || input.applications.length === 0) {
            throw new DomainError(
                ApplicationErrorCode.APPLICATIONS_ARRAY_EMPTY,
                'Applications array cannot be empty'
            )
        }

        const child = await this.userRepository.findById(input.childId);
        if(!child || !child.isChild()) {
            throw new DomainError(
                UserErrorCode.INVALID_CHILD,
                `Child with id ${input.childId} is invalid.`,
            );
        }

        const filteredApplications = input.applications.filter((app, index, self) =>
            index === self.findIndex(a => a.packageName === app.packageName)
        );

        const apps: Application[] = filteredApplications.map((app) =>
            Application.create(
                this.idGenerator.generate(),
                input.childId,
                app.packageName,
                app.name,
                app.versionName,
                app.versionCode,
                app.status,
                null
            )
        );

        const result = await this.applicationRepository.saveMany(apps);
        const enriched = await Promise.all(
            result.map(async (app) => {
                let detail = null;

                try {
                    detail =
                        await this.applicationDetailRepository.getByPackageName(
                            app.getPackageName(),
                        );
                } catch (_) {}

                return {
                    id: app.getId(),
                    childId: app.getChildId(),
                    packageName: app.getPackageName(),
                    name: app.getName(),
                    versionName: app.getVersionName(),
                    versionCode: app.getVersionCode(),
                    status: app.getStatus(),
                    detail,
                    createdAt: app.getCreatedAt()!,
                    updatedAt: app.getUpdatedAt()!,
                };
            }),
        );

        return {
            childId: input.childId,
            applications: enriched,
        };
    }

    async getApplicationDetailByPackageName(input: ApplicationDetailInput): Promise<ApplicationDetailOutput> {
        try {
            const detail = await this.applicationDetailRepository.getByPackageName(
                input.packageName,
            );
            return {
                packageName: detail.getPackageName(),
                title: detail.getTitle(),
                description: detail.getDescription(),
                developer: detail.getDeveloper(),
                genre: detail.getGenre(),
                categories: detail.getCategories(),
            };
        } catch(error: any) {
            if (error.status === 404) {
                throw new DomainError(ApplicationErrorCode.APPLICATION_DETAIL_NOT_FOUND, 'Application not found');
            }

            throw error;
        }
    }
}