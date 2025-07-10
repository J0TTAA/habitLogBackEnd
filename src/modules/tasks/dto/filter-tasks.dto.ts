import { IsEnum, IsOptional, IsMongoId } from "class-validator"
import { TaskStatus } from "../../../schemas/task.schema"

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus

  @IsOptional()
  @IsMongoId()
  categoryId?: string

  @IsOptional()
  includeDeleted?: boolean
}
