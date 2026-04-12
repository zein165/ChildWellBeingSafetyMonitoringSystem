import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../../domain/application.repository';
import { Application, ApplicationStatus } from '../../domain/application.entity';
import { ApplicationUsage } from '../../domain/application-usage.entity';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getByChildId(id: string): Promise<Application[]> {
        const applications = await this.prisma.application.findMany({
            where: { childId: id }
        });
        return applications.map(app => Application.fromPersistence(app as any));
    }

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
                        status: app.getStatus() as any,
                    },
                    update: {
                        name: app.getName(),
                        status: app.getStatus() as any,
                    },
                })
            )
        ).then(results =>
            results.map(app => Application.fromPersistence(app as any))
        );
    }

    async syncApplications(childId: string, applications: Application[]): Promise<Application[]> {
        const packageNames = applications.map(app => app.getPackageName());

        return this.prisma.$transaction(async (tx) => {
            // Upsert reported apps
            const upsertPromises = applications.map(app =>
                tx.application.upsert({
                    where: {
                        childId_packageName: {
                            childId: childId,
                            packageName: app.getPackageName(),
                        },
                    },
                    create: {
                        id: app.getId(),
                        childId: childId,
                        packageName: app.getPackageName(),
                        name: app.getName(),
                        status: ApplicationStatus.INSTALLED,
                    },
                    update: {
                        name: app.getName(),
                        status: ApplicationStatus.INSTALLED,
                    },
                })
            );

            // Mark missing apps as REMOVED
            const removePromise = tx.application.updateMany({
                where: {
                    childId: childId,
                    packageName: { notIn: packageNames },
                    status: ApplicationStatus.INSTALLED
                },
                data: {
                    status: ApplicationStatus.REMOVED
                }
            });

            await Promise.all([...upsertPromises, removePromise]);

            const allApps = await tx.application.findMany({
                where: { childId }
            });

            return allApps.map(app => Application.fromPersistence(app as any));
        });
    }

    async saveUsage(usages: ApplicationUsage[]): Promise<void> {
        await this.prisma.$transaction(
            usages.map(usage =>
                this.prisma.applicationUsage.upsert({
                    where: {
                        applicationId_date: {
                            applicationId: usage.getApplicationId(),
                            date: usage.getDate(),
                        },
                    },
                    create: {
                        id: usage.getId(),
                        applicationId: usage.getApplicationId(),
                        date: usage.getDate(),
                        duration: usage.getDuration(),
                    },
                    update: {
                        duration: usage.getDuration(),
                    },
                })
            )
        );
    }
}