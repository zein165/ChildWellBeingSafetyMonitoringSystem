import { Body, Controller, Post } from '@nestjs/common';
import { TrackingUseCase } from '../../application/tracking.usecase';
import type { TrackingRequestDto } from './dto/tracking.dto';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingUseCase: TrackingUseCase) {}

    @Post()
    async track(@Body() body: TrackingRequestDto) {
        const result = await this.trackingUseCase.track(body);
        return ApiResponse.success('Tracking data processed successfully', result);
    }
}
