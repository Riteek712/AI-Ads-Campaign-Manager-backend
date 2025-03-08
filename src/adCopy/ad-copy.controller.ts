import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AdCopyService } from './ad-copy.service';
import { GenerateAdCopyDto, AdCopyResponseDto } from './ad-copy.dto';


@Controller('ad-copy')
export class AdCopyController {
  constructor(private readonly adCopyService: AdCopyService) {}

  @Post('generate')
  async generateAdCopy(@Body() generateAdCopyDto: GenerateAdCopyDto): Promise<AdCopyResponseDto> {
    const adCopy = await this.adCopyService.generateAdCopy(generateAdCopyDto);
    if (!adCopy) throw new NotFoundException('Failed to generate ad copy');
    return adCopy;
  }
}
