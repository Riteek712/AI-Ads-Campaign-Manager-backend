import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Marketing Campaign', description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
