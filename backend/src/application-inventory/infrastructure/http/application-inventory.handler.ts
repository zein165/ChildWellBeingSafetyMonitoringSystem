import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { ApplicationInventoryUseCase } from '../../application/application-inventory.usecase';
import { RegisterApplicationRequest } from './dto/sync-application.dto';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('applications')
export class ApplicationInventoryHandler {
    constructor(
        private readonly applicationInventoryUseCase: ApplicationInventoryUseCase,
    ) {}

    @Get()
    async getApplicationByChild(@Query('childId') childId: string) {
        if (!childId) {
            throw new BadRequestException(
                'childId query parameter is required',
            );
        }

        const result =
            await this.applicationInventoryUseCase.getChildApplications({
                childId,
            });

        return ApiResponse.success(
            'Successfully retrieved child applications',
            result,
        );
    }

    @Post()
    async synchronize(@Body() body: RegisterApplicationRequest) {
        const result =
            await this.applicationInventoryUseCase.syncApplication(body);
        return ApiResponse.success(
            'An application successfully updated',
            result,
        );
    }
}
