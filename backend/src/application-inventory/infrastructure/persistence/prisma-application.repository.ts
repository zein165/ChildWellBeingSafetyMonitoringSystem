import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../../domain/application.repository';
import { Application } from '../../domain/application.entity';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveMany(applications: Application[]): Promise<Application[]> {
        return this.prisma.$transaction(
            applications.map(app =>
                this.prisma.application.upsert({
                    where: {
                        childId_packageName: {
                            childId: app.getChildId(),
                            packageName: app.getPackageName(),
                        },
                    },
                    create: {
                        id: app.getId(),
                        childId: app.getChildId(),
                        packageName: app.getPackageName(),
                        name: app.getName(),
                        versionName: app.getVersionName(),
                        versionCode: app.getVersionCode(),
                        status: app.getStatus(),
                    },
                    update: {
                        name: app.getName(),
                        versionName: app.getVersionName(),
                        versionCode: app.getVersionCode(),
                        status: app.getStatus(),
                    },
                })
            )
        ).then(results =>
            results.map(app => Application.fromPersistence(app))
        );
    }
}