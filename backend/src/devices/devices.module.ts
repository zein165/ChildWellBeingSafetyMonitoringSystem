import { Module } from '@nestjs/common';
import { DeviceHandler } from './infrastructure/http/device.handler';
import { DeviceUsecase } from './application/device.usecase';
import { PrismaDeviceRepository } from './infrastructure/persistence/prisma-device.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [DeviceHandler],
    providers: [
        DeviceUsecase,
        {
        provide: 'DeviceRepository',
        useClass: PrismaDeviceRepository,
        },
        PrismaService
    ],
    exports: [DeviceUsecase],
})
export class DevicesModule {}