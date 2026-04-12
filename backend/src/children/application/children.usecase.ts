import { Inject, Injectable } from '@nestjs/common';
import type { ChildrenRepository } from '../domain/children.repository';
import { Child } from '../domain/child';

@Injectable()
export class ChildrenUsecase {
    constructor(
        @Inject('ChildrenRepository')
        private readonly repo: ChildrenRepository,
    ) {}

    async getChildrenByParentId(parentId: string): Promise<Child[]> {
        return this.repo.findChildrenByParentId(parentId);
    }
}
