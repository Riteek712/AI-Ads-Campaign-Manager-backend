import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createCampaignDto: CreateCampaignDto, email: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { email }, 
      include: { projects: true } 
    });
  
    if (!user) throw new NotFoundException('User not found');
  
    const project = user.projects.find(p => p.id === createCampaignDto.projectId);
    if (!project) throw new ForbiddenException('Access denied');
  
    return this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        projectId: project.id,
        startDate: new Date(createCampaignDto.startDate), // Convert to Date
        endDate: new Date(createCampaignDto.endDate), // Convert to Date
      },
    });
  }
  

  async findAll(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, include: { projects: { include: { campaigns: true } } } });
    if (!user) throw new NotFoundException('User not found');

    return user.projects.flatMap(p => p.campaigns);
  }

  async findOne(id: string, email: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id }, include: { project: true } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (campaign.project.userId !== user?.id) throw new ForbiddenException('Access denied');

    return campaign;
  }

  async update(id: string, email: string, updateCampaignDto: UpdateCampaignDto) {
    await this.findOne(id, email);
    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
    });
  }

  async remove(id: string, email: string) {
    await this.findOne(id, email);
    return this.prisma.campaign.delete({ where: { id } });
  }
}
