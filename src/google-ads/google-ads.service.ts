import { Injectable } from '@nestjs/common';
import { GoogleAdsApi, Customer, enums, ResourceNames, toMicros } from 'google-ads-api';
import { GoogleAdsConfig } from 'src/common/utils/google-ads.utils';
@Injectable()
export class GoogleAdsService {
  private client: GoogleAdsApi;
  private customer: Customer;

  constructor() {
    // Initialize the Google Ads API Client
    this.client = new GoogleAdsApi({
      client_id: GoogleAdsConfig.client_id,
      client_secret: GoogleAdsConfig.client_secret,
      developer_token: GoogleAdsConfig.developer_token,
    });

    // Create a Customer Instance
    this.customer = this.client.Customer({
      customer_id: GoogleAdsConfig.customer_id,
      refresh_token: GoogleAdsConfig.refresh_token,
    });
  }

  /**
   * Fetch all campaigns
   */
  async getCampaigns() {
    try {
      const campaigns = await this.customer.report({
        entity: 'campaign',
        attributes: ['campaign.id', 'campaign.name'],
        metrics: ['metrics.clicks', 'metrics.impressions'],
        constraints: {
          'campaign.status': enums.CampaignStatus.ENABLED,
        },
        limit: 10,
      });

      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(name: string, budget: number) {
    try {
      const budgetResourceName = ResourceNames.campaignBudget(this.customer.credentials.customer_id, '-1');

      const operations = [
        {
          create: {
            campaign_budget: {
              resource_name: budgetResourceName,
              name: `${name} Budget`,
              delivery_method: enums.BudgetDeliveryMethod.STANDARD,
              amount_micros: toMicros(budget),
            },
          },
        },
        {
          create: {
            campaign: {
              name: name,
              advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
              status: enums.CampaignStatus.PAUSED,
              campaign_budget: budgetResourceName,
            },
          },
        },
      ];

      const result = await this.customer.mutateResources(operations);
      return result;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
}
