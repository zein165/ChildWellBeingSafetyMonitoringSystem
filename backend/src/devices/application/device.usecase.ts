import { Inject, Injectable } from '@nestjs/common';
import type { DeviceRepository } from '../domain/device.repository';
import { devicePresence } from '../domain/device-presence';
import { Device } from '../domain/device';
import { HeartbeatDto } from '../infrastructure/http/dto/heartbeat.dto';

@Injectable()
export class DeviceUsecase {
    constructor(
        @Inject('DeviceRepository')
        private readonly repo: DeviceRepository,
  ) {}

    async getDevicesByParent(parentId: string): Promise<Device[]> {
        const relations = await this.repo.findChildrenByParent(parentId);

        return relations.map(r => {
            if (!r.child) {
                throw new Error(`Child data not found for childId ${r.childId}`);
            }
            return {
                id: r.child.id,
            name: r.child.username,
            status: devicePresence.isOnline(r.child.id)
                ? 'ONLINE'
                : 'OFFLINE',
            } as Device;
        });
    }

    async updateHeartbeat(dto: HeartbeatDto) {
        devicePresence.heartbeat(dto.childId);
        return { updatedAt: new Date() };
    }

}