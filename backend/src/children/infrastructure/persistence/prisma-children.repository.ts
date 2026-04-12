import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChildrenRepository } from 'src/children/domain/children.repository';
import { Child } from 'src/children/domain/child';

@Injectable()
export class PrismaChildrenRepository implements ChildrenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findChildrenByParentId(parentId: string): Promise<Child[]> {
        const relations = await this.prisma.childRelation.findMany({
            where: { parentId },
            include: {
                child: true,
            },
        });

        return relations.map((relation) => ({
            id: relation.child.id,
            username: relation.child.username,
            role: relation.child.role,
            createdAt: relation.child.createdAt,
            updatedAt: relation.child.updatedAt,
        }));
    }
}
