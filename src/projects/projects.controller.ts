import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @Request() req: any) {
    return this.projectsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(+id, req.user.id, req.user.role);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Request() req: any,
  ) {
    return this.projectsService.update(+id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.remove(+id, req.user.id, req.user.role);
  }
}