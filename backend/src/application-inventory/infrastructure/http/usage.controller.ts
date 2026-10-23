import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsageUseCase } from '../../application/usage.usecase';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('usage')
export class UsageController {
    constructor(private readonly usageUseCase: UsageUseCase) {}

    @Get('summary/:childId')
    async getSummary(@Param('childId') childId: string) {
        const result = await this.usageUseCase.getWeeklySummary(childId);
        return ApiResponse.success('Successfully retrieved weekly usage summary', result);
    }

    @Get('details/:childId')
    async getDetails(
        @Param('childId') childId: string,
        @Query('date') date?: string,
    ) {
        const result = await this.usageUseCase.getDailyDetails(childId, date);
        return ApiResponse.success('Successfully retrieved daily usage details', result);
    }
}
