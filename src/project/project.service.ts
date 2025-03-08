import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createProjectDto: CreateProjectDto, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        userId: user.id,
      },
    });
  }

  async findAll(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // return this.prisma.project.findMany({ where: { userId: user.id } });
    return this.prisma.project.findMany({ where: { userId: user.id } });
  }

  async findOne(id: string, email: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (project.userId !== user.id) throw new ForbiddenException('Access denied');

    return project;
  }

  async update(id: string, email: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id, email);
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string, email: string) {
    await this.findOne(id, email);
    return this.prisma.project.delete({ where: { id } });
  }
}
