import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsDate, IsArray, IsEnum, IsOptional } from 'class-validator';
import { CampaignStatus } from '@prisma/client'; // Import from Prisma
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @ApiProperty({ example: 'project-id-123', description: 'ID of the project' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 500.0, description: 'Campaign budget' })
  @IsNumber()
  budget: number;

  @ApiProperty({ example: 'RUNNING', enum: CampaignStatus, description: 'Campaign status' })
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @ApiProperty({ example: ['keyword1', 'keyword2'], description: 'Target keywords' })
  @IsArray()
  targetKeywords: string[];

  @ApiProperty({ example: '2024-05-01', description: 'Start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-06-01', description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: 'GOOGLE', description: 'Ad platform' })
  @IsString()
  adPlatform: string;

  @ApiProperty({ example: '{}', description: 'Ad performance metrics JSON', required: false })
  @IsOptional()
  adPerformanceMetrics?: object;
}
