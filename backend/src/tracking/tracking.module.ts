import { Module } from '@nestjs/common';
import { TrackingUseCase } from './application/tracking.usecase';
import { TrackingController } from './infrastructure/http/tracking.controller';
import { PrismaUserRepository } from '../auth/infrastructure/persistence/prisma-user.repository';
import { PrismaApplicationRepository } from '../application-inventory/infrastructure/persistence/prisma-application.repository';
import { PrismaLocationRepository } from './infrastructure/persistence/prisma-location.repository';
import { UuidIdGenerator } from '../common/infrastructure/security/uuid-id.generator';

@Module({
    providers: [
        TrackingUseCase,
        {
            provide: 'UserRepository',
            useClass: PrismaUserRepository
        },
        {
            provide: 'ApplicationRepository',
            useClass: PrismaApplicationRepository,
        },
        {
            provide: 'LocationRepository',
            useClass: PrismaLocationRepository,
        },
        {
            provide: 'IdGenerator',
            useClass: UuidIdGenerator
        }
    ],
    controllers: [TrackingController],
})
export class TrackingModule {}
