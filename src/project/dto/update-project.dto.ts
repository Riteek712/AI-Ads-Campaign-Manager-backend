import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ example: 'Updated Project Name', description: 'Updated name of the project', required: false })
  name?: string;
}
