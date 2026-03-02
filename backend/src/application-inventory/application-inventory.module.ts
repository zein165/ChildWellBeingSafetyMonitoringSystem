import { Module } from '@nestjs/common';
import { ApplicationInventoryUseCase } from './application/application-inventory.usecase';
import { PrismaApplicationRepository } from './infrastructure/persistence/prisma-application.repository';
import { UuidIdGenerator } from '../common/infrastructure/security/uuid-id.generator';
import { ApplicationInventoryHandler } from './infrastructure/http/application-inventory.handler';
import { PrismaUserRepository } from '../auth/infrastructure/persistence/prisma-user.repository';
import {
    GooglePlayScraperApplicationDetailRepository
} from './infrastructure/persistence/google-play-scraper-application-detail.repository';

@Module({
    providers: [
        ApplicationInventoryUseCase,
        {
            provide: 'UserRepository',
            useClass: PrismaUserRepository
        },
        {
            provide: 'ApplicationRepository',
            useClass: PrismaApplicationRepository,
        },
        {
            provide: 'ApplicationDetailRepository',
            useClass: GooglePlayScraperApplicationDetailRepository
        },
        {
            provide: 'IdGenerator',
            useClass: UuidIdGenerator
        }
    ],
    controllers: [ApplicationInventoryHandler],
})

export class ApplicationInventoryModule {}