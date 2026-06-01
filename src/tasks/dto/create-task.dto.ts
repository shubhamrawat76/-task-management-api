import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class CreateTaskDto {

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsNotEmpty()
  @IsNumber()
  projectId!: number;

  @IsOptional()
  @IsNumber()
  assigneeId!: number;
}