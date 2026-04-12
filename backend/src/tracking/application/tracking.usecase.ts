import { Inject, Injectable, Logger } from '@nestjs/common';

import { TrackingRequestDto } from '../infrastructure/http/dto/tracking.dto';
import type { UserRepository } from 'src/auth/domain/user.repository';
import type { ApplicationRepository } from 'src/application-inventory/domain/application.repository';
import type { LocationRepository } from '../domain/location.repository';
import type { IdGenerator } from 'src/common/interfaces/id-generator.interface';

import { Application, ApplicationStatus } from 'src/application-inventory/domain/application.entity';
import { DomainError } from 'src/common/errors/domain.error';
import { UserErrorCode } from 'src/auth/domain/user-error-code.enum';
import { UserRole } from 'src/auth/domain/user.entity';
import { ApplicationUsage } from 'src/application-inventory/domain/application-usage.entity';
import { Location } from '../domain/location.entity';
import { LocationCalculator } from './utils/location-calculator.util';

const MOVEMENT_THRESHOLD_METERS = 50;

@Injectable()
export class TrackingUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        @Inject('ApplicationRepository')
        private readonly applicationRepository: ApplicationRepository,
        @Inject('LocationRepository')
        private readonly locationRepository: LocationRepository,
        @Inject('IdGenerator')
        private readonly idGenerator: IdGenerator,
    ) {}

    async track(input: TrackingRequestDto) {
        // 1. Validate child
        const user = await this.userRepository.findById(input.childId);
        if (!user || user.getRole() !== UserRole.CHILD) {
            throw new DomainError(
                UserErrorCode.INVALID_CHILD,
                `User ID ${input.childId} is not a valid child.`,
            );
        }

        // 2. Synchronize applications
        const applications = input.apps.map(app => 
            Application.create(
                this.idGenerator.generate(),
                input.childId,
                app.packageName,
                app.appName,
                ApplicationStatus.INSTALLED,
            )
        );

        const syncResult = await this.applicationRepository.syncApplications(
            input.childId,
            applications
        );

        // 3. Process usage data
        if (input.usage && Object.keys(input.usage).length > 0) {
            const now = new Date();
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            const usageEntities: ApplicationUsage[] = [];

            for (const [packageName, duration] of Object.entries(input.usage)) {
                // Find corresponding application from sync result
                const app = syncResult.find(a => a.getPackageName() === packageName);
                
                if (app) {
                    usageEntities.push(
                        ApplicationUsage.create(
                            this.idGenerator.generate(),
                            app.getId(),
                            today,
                            BigInt(duration)
                        )
                    );
                }
            }

            if (usageEntities.length > 0) {
                await this.applicationRepository.saveUsage(usageEntities);
            }
        }

        // 4. Track location if changed significantly
        const lastLocation = await this.locationRepository.findLastByChildId(input.childId);
        
        let hasLocationChanged = false;
        if (!lastLocation) {
            hasLocationChanged = true;
        } else {
            const distance = LocationCalculator.calculateDistance(
                lastLocation.getLatitude(),
                lastLocation.getLongitude(),
                input.latitude,
                input.longitude
            );
            hasLocationChanged = distance > MOVEMENT_THRESHOLD_METERS;
        }

        if (hasLocationChanged) {
            const newLocation = Location.create(
                this.idGenerator.generate(),
                input.childId,
                input.latitude,
                input.longitude
            );
            await this.locationRepository.save(newLocation);
        }
        
        return {
            childId: input.childId,
            synchronizedApps: syncResult.length,
            trackedUsageApps: Object.keys(input.usage || {}).length,
            locationUpdated: hasLocationChanged
        };
    }
}
