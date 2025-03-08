import { ApiProperty } from '@nestjs/swagger';

export class GenerateAdCopyDto {
  @ApiProperty({ description: 'The ID of the campaign for which the ad copy is being generated' })
  campaignId: string;

  @ApiProperty({ 
    description: 'The advertising platform for which the ad copy is being generated',
    enum: ['GOOGLE', 'FACEBOOK', 'LINKEDIN']
  })
  platform: 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN';

  @ApiProperty({ 
    description: 'List of keywords to target in the ad copy',
    type: [String]
  })
  keywords: string[];

  @ApiProperty({ 
    description: 'Optional tone of the ad copy',
    enum: ['professional', 'casual', 'exciting'],
    required: false
  })
  tone?: 'professional' | 'casual' | 'exciting';
}

export class AdCopyResponseDto {
  @ApiProperty({ description: 'Unique identifier of the generated ad copy' })
  id: string;

  @ApiProperty({ description: 'The campaign ID associated with the ad copy' })
  campaignId: string;

  @ApiProperty({ 
    description: 'The advertising platform for which the ad copy was created',
    enum: ['GOOGLE', 'FACEBOOK', 'LINKEDIN']
  })
  platform: 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN';

  @ApiProperty({ description: 'The generated ad copy text' })
  text: string;

  @ApiProperty({ 
    description: 'Optional sentiment analysis result (Positive, Neutral, Negative)',
    required: false
  })
  sentiment?: string;

  @ApiProperty({ description: 'Timestamp when the ad copy was created' })
  createdAt: Date;
}
