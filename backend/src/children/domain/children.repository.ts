import { Child } from './child';

export interface ChildrenRepository {
    findChildrenByParentId(parentId: string): Promise<Child[]>;
}
