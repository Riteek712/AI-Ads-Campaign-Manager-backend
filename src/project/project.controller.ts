import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEmail } from 'src/common/decorators/user-email.decorator';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description:'Create a new project.', summary: 'Create a new project.' })
  @Post()
  async create(@UserEmail() email: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto, email);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description:'Get all projects.', summary: 'Get all projects.' })
  @Get()
  async findAll(@UserEmail() email: string) {
    return this.projectService.findAll(email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ description:'Get a project by id.', summary: 'Get a project by id.' })
  async findOne(
    @Param('id') id: string,
    @UserEmail() email: string){
    return this.projectService.findOne(id, email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ description:'Update a project by id.', summary: 'Update a project by id.' })
  async update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto,
    @UserEmail() email: string) {
    return this.projectService.update(id,email, updateProjectDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ description:'Delete a project by id.', summary: 'Delete a project by id.' })
  async  remove(
    @Param('id') id: string,
    @UserEmail() email: string) {
    return this.projectService.remove(id, email);
  }
}
