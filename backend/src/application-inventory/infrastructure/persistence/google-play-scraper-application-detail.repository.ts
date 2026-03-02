import { Injectable } from '@nestjs/common';
import gplay from 'google-play-scraper';
import { ApplicationDetailRepository } from '../../domain/application-detail.repository';
import { ApplicationDetail } from '../../domain/application-detail.entity';

@Injectable()
export class GooglePlayScraperApplicationDetailRepository implements ApplicationDetailRepository {
    async getByPackageName(packageName: string): Promise<ApplicationDetail> {
        const detail = await gplay.app({ appId: packageName });
        return ApplicationDetail.create(
            detail.appId,
            detail.title,
            detail.description,
            detail.developer,
            detail.genre,
            detail.categories
        );
    }
}