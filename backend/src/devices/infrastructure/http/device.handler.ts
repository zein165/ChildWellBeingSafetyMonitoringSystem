import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Query,
    Post,
} from '@nestjs/common';
import { DeviceUsecase } from 'src/devices/application/device.usecase';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('devices')
export class DeviceHandler {
    constructor(private readonly devicesUsecase: DeviceUsecase) {}

    @Get()
    async getDevicesByParent(
        @Query('parentId') parentId: string
    ) {
        if (!parentId) {
        throw new BadRequestException('parentId query parameter is required');
        }

        const devices = await this.devicesUsecase.getDevicesByParent(parentId);

        return ApiResponse.success(
        'Successfully retrieved child devices',
        devices
        );
    }

    @Post('heartbeat')
    async heartbeat(@Body() body: HeartbeatDto) {
        if (!body.childId) {
        throw new BadRequestException('childId is required in request body');
        }

        const result = await this.devicesUsecase.updateHeartbeat(body);

        return ApiResponse.success(
        'Heartbeat updated successfully',
        result
        );
    }
}