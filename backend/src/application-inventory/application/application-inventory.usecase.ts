import { Inject, Injectable } from '@nestjs/common';
import type { IdGenerator } from '../../common/interfaces/id-generator.interface';

import {
    SyncApplicationInput,
    SyncApplicationOutput,
} from './dto/sync-application.dto';

import type { UserRepository } from '../../auth/domain/user.repository';
import type { ApplicationRepository } from '../domain/application.repository';

import { Application } from '../domain/application.entity';
import { DomainError } from '../../common/errors/domain.error';
import { UserErrorCode } from '../../auth/domain/user-error-code.enum';
import { ApplicationErrorCode } from '../domain/application-error-code.enum';

@Injectable()
export class ApplicationInventoryUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,

        @Inject('ApplicationRepository')
        private readonly applicationRepository: ApplicationRepository,

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
            ),
        );

        const result = await this.applicationRepository.saveMany(apps);
        return {
            childId: input.childId,
            applications: result.map((item) => ({
                id: item.getId(),
                childId: item.getChildId(),
                packageName: item.getPackageName(),
                name: item.getName(),
                versionName: item.getVersionName(),
                versionCode: item.getVersionCode(),
                status: item.getStatus(),
                createdAt: item.getCreatedAt()!,
                updatedAt: item.getUpdatedAt()!,
            })),
        };
    }
}