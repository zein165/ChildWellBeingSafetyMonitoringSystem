export interface DeviceRepository {
    findChildrenByParent(parentId: string): Promise<any[]>;
}