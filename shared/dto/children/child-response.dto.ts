export interface ChildResponseDto {
    id: string; 
    role: 'CHILD';
    parentId: string;
    createdAt: Date;
}