import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto, userId: number) {
    const project = this.projectRepository.create({
      name: dto.name,
      description: dto.description,
      owner: { id: userId },
    });
    return this.projectRepository.save(project);
  }

  async findAll(userId: number, userRole: string) {
    if (userRole === Role.ADMIN) {
      return this.projectRepository.find();
    }
    return this.projectRepository.find({
      where: { owner: { id: userId } },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    if (userRole !== Role.ADMIN && project.owner.id !== userId) {
      throw new ForbiddenException('You do not own this project');
    }

    return project;
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    userId: number,
    userRole: string,
  ) {
    const project = await this.findOne(id, userId, userRole);
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(id: number, userId: number, userRole: string) {
    const project = await this.findOne(id, userId, userRole);
    await this.projectRepository.remove(project);
    return { message: `Project #${id} deleted successfully` };
  }
}