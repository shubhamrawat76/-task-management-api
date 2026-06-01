import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, userId: number) {
    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      project: { id: dto.projectId },
      assignee: dto.assigneeId ? { id: dto.assigneeId } : null,
      createdBy: { id: userId },
    });
    return this.taskRepository.save(task);
  }

  async findAll(userId: number, userRole: string) {
    if (userRole === Role.ADMIN) {
      return this.taskRepository.find();
    }
    return this.taskRepository.find({
      where: { createdBy: { id: userId } },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    if (
      userRole !== Role.ADMIN &&
      task.createdBy.id !== userId &&
      task.assignee?.id !== userId
    ) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
    userRole: string,
  ) {
    const task = await this.findOne(id, userId, userRole);

    if (dto.assigneeId) {
      task.assignee = { id: dto.assigneeId } as any;
    }

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
    });

    return this.taskRepository.save(task);
  }

  async remove(id: number, userId: number, userRole: string) {
    const task = await this.findOne(id, userId, userRole);
    await this.taskRepository.remove(task);
    return { message: `Task #${id} deleted successfully` };
  }
}