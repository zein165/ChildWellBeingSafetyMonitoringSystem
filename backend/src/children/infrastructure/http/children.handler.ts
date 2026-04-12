import {
    BadRequestException,
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { ChildrenUsecase } from 'src/children/application/children.usecase';
import { ApiResponse } from '../../../common/http/response.helper';

@Controller('children')
export class ChildrenHandler {
    constructor(private readonly childrenUsecase: ChildrenUsecase) {}

    @Get()
    async getChildrenByParent(
        @Query('parentId') parentId: string,
    ) {
        if (!parentId) {
            throw new BadRequestException('parentId query parameter is required');
        }

        const children = await this.childrenUsecase.getChildrenByParentId(parentId);

        return ApiResponse.success(
            'Successfully retrieved children',
            children,
        );
    }
}
