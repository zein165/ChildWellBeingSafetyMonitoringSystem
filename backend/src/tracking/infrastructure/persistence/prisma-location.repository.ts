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
}
