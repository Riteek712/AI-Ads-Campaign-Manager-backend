import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GenerateAdCopyDto, AdCopyResponseDto } from './ad-copy.dto';
import { OpenAI } from 'openai';

@Injectable()
export class AdCopyService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private readonly prisma: DatabaseService) {}

  async generateAdCopy(generateAdCopyDto: GenerateAdCopyDto): Promise<AdCopyResponseDto> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: generateAdCopyDto.campaignId },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    const tone = generateAdCopyDto.tone || 'persuasive';
    const keywords = campaign.targetKeywords.join(', ');

    // Generate Ad Copy
    const adResponse = await this.openai.completions.create({
      model: 'gpt-4o-mini',
      prompt: `Generate an ad copy for ${generateAdCopyDto.platform} targeting ${keywords}.
      The ad should have a ${tone} tone and be under 150 characters.`,
      max_tokens: 50,
    });

    const generatedText = adResponse.choices[0].text.trim();

    // Perform Sentiment Analysis
    const sentimentResponse = await this.openai.completions.create({
      model: 'gpt-4o-mini',
      prompt: `Analyze the sentiment of this ad copy: "${generatedText}". Reply with one word: Positive, Neutral, or Negative.`,
      max_tokens: 10,
    });

    const sentiment = sentimentResponse.choices[0].text.trim();

    // Save Ad Copy to Database
    const newAdCopy = await this.prisma.adCopy.create({
      data: {
        campaignId: generateAdCopyDto.campaignId,
        platform: generateAdCopyDto.platform,
        text: generatedText,
      },
    });

    return {
      id: newAdCopy.id,
      campaignId: newAdCopy.campaignId,
      platform: newAdCopy.platform,
      text: newAdCopy.text,
      sentiment,
      createdAt: newAdCopy.createdAt,
    };
  }
}
