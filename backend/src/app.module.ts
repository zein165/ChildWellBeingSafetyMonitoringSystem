import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationInventoryModule } from './application-inventory/application-inventory.module';
import { DevicesModule } from './devices/devices.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),

        PrismaModule,
        AuthModule,
        ApplicationInventoryModule,
        DevicesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
