import { Inject, Injectable } from '@nestjs/common';
import type { ApplicationRepository } from '../domain/application.repository';
import type { UserRepository } from '../../auth/domain/user.repository';
import { DomainError } from '../../common/errors/domain.error';
import { UserErrorCode } from '../../auth/domain/user-error-code.enum';

@Injectable()
export class UsageUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        @Inject('ApplicationRepository')
        private readonly applicationRepository: ApplicationRepository,
    ) {}

    async getWeeklySummary(childId: string) {
        await this.validateChild(childId);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const summary = await this.applicationRepository.getUsageByChildIdAndDateRange(
            childId,
            startDate,
            endDate,
        );

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const formatDate = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const fullSummary = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const dayName = days[date.getDay()];
            const dateKey = formatDate(date);

            const found = summary.find(
                s => formatDate(new Date(s.date)) === dateKey
            );

            fullSummary.push({
                day: dayName,
                date: dateKey,
                value: found ? Number(found.duration / BigInt(1000 * 60)) : 0, // minutes
                active: i === 0,
            });
        }

        return fullSummary;
    }

    async getDailyDetails(childId: string, dateString?: string) {
        await this.validateChild(childId);

        const date = dateString ? new Date(dateString) : new Date();
        date.setHours(0, 0, 0, 0);

        const usages = await this.applicationRepository.getUsageByChildIdAndDate(
            childId,
            date,
        );

        return usages
            .filter(u => u.getDuration() > BigInt(0))
            .map(u => {
                const durationMinutes = Number(u.getDuration() / BigInt(1000 * 60));
                return {
                    id: u.getId(),
                    applicationId: u.getApplicationId(),
                    packageName: u.application.getPackageName(),
                    appName: u.application.getName(),
                    durationMinutes: durationMinutes,
                    timeDisplay: this.formatDuration(durationMinutes),
                };
            });
    }

    private async validateChild(childId: string) {
        const child = await this.userRepository.findById(childId);
        if (!child || !child.isChild()) {
            throw new DomainError(
                UserErrorCode.INVALID_CHILD,
                `Child with id ${childId} is invalid.`,
            );
        }
    }

    private formatDuration(minutes: number): string {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }
}
