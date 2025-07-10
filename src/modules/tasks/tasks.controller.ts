import { Controller, Get, Post, Patch, Param, Delete, Body, Query } from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { CreateTaskDto } from "./dto/create-task.dto"
import { UpdateTaskDto } from "./dto/update-task.dto"
import { FilterTasksDto } from "./dto/filter-tasks.dto"

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto)
  }

  @Get()
  findAll(@Query() filterDto: FilterTasksDto) {
    return this.tasksService.findAll(filterDto)
  }

  @Get("deleted")
  getDeletedTasks() {
    return this.tasksService.getDeletedTasks()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id)
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.softDelete(id)
  }

  @Post(':id/complete')
  completeTask(@Param('id') id: string) {
    return this.tasksService.completeTask(id)
  }

  @Post(':id/restore')
  restoreTask(@Param('id') id: string) {
    return this.tasksService.restoreTask(id)
  }
}
