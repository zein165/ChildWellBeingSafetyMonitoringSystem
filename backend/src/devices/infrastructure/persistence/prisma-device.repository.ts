import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DeviceRepository } from 'src/devices/domain/device.repository';

@Injectable()
export class PrismaDeviceRepository implements DeviceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findChildrenByParent(parentId: string): Promise<any[]> {
        const relations = await this.prisma.childRelation.findMany({
            where: { parentId },
            include: {
                child: true,
            },
        });

        return relations
    }
}
