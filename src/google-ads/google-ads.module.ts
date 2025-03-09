import { Module } from '@nestjs/common';
import { GoogleAdsService } from './google-ads.service';

@Module({
  providers: [GoogleAdsService],
  exports: [GoogleAdsService],
})
export class GoogleAdsModule {}
