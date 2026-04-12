import { Module } from '@nestjs/common';
import { ChildrenHandler } from './infrastructure/http/children.handler';
import { ChildrenUsecase } from './application/children.usecase';
import { PrismaChildrenRepository } from './infrastructure/persistence/prisma-children.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ChildrenHandler],
    providers: [
        ChildrenUsecase,
        {
            provide: 'ChildrenRepository',
            useClass: PrismaChildrenRepository,
        },
        PrismaService,
    ],
    exports: [ChildrenUsecase],
})
export class ChildrenModule {}
