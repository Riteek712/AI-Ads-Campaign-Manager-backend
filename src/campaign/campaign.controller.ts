import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEmail } from 'src/common/decorators/user-email.decorator';

@ApiTags('Campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a new campaign.', summary: 'Create a new campaign.' })
  @Post()
  async create(@Body() createCampaignDto: CreateCampaignDto, @UserEmail() email: string) {
    return this.campaignService.create(createCampaignDto, email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all campaigns for a user.', summary: 'Get all campaigns.' })
  @Get()
  async findAll(@UserEmail() email: string) {
    return this.campaignService.findAll(email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get a campaign by ID.', summary: 'Get campaign by ID.' })
  @Get(':id')
  async findOne(@Param('id') id: string, @UserEmail() email: string) {
    return this.campaignService.findOne(id, email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Update a campaign by ID.', summary: 'Update campaign by ID.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto, @UserEmail() email: string) {
    return this.campaignService.update(id, email, updateCampaignDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Delete a campaign by ID.', summary: 'Delete campaign by ID.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @UserEmail() email: string) {
    return this.campaignService.remove(id, email);
  }
}
