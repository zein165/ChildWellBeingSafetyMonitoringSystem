import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationInventoryUseCase } from '../../application/application-inventory.usecase';
import { RegisterApplicationRequest } from './dto/sync-application.dto';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('applications')
export class ApplicationInventoryHandler {
    constructor(private readonly applicationInventoryUseCase: ApplicationInventoryUseCase) {}

    @Post()
    async synchronize(@Body() body: RegisterApplicationRequest) {
        const result = await this.applicationInventoryUseCase.syncApplication(body)
        return ApiResponse.success('An application successfully updated', result)
    }
}