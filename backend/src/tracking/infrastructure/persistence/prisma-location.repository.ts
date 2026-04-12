import { Injectable } from '@nestjs/common';
import { LocationRepository } from '../../domain/location.repository';
import { Location } from '../../domain/location.entity';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaLocationRepository implements LocationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(location: Location): Promise<void> {
        await this.prisma.location.create({
            data: {
                id: location.getId(),
                childId: location.getChildId(),
                latitude: location.getLatitude(),
                longitude: location.getLongitude(),
            },
        });
    }

    async findLastByChildId(childId: string): Promise<Location | null> {
        const lastLocation = await this.prisma.location.findFirst({
            where: { childId },
            orderBy: { createdAt: 'desc' },
        });

        if (!lastLocation) {
            return null;
        }

        return Location.fromPersistence(lastLocation as any);
    }

    async findByDate(childId: string, date: Date): Promise<Location[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const locations = await this.prisma.location.findMany({
            where: {
                childId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return locations.map((loc) => Location.fromPersistence(loc as any));
    }
}
