import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class UpdateTaskDto {

  @IsOptional()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsNumber()
  assigneeId!: number;
}