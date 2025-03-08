import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { CampaignModule } from './campaign/campaign.module';
import { AdCopyModule } from './adCopy/ad-copy.module';

@Module({
  imports: [DatabaseModule, AuthModule, DatabaseModule, ProjectModule, CampaignModule, AdCopyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
