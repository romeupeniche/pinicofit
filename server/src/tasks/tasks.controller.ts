import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.tasksService.list(req.user.sub);
  }

  @Get('today')
  today(
    @Req() req: { user: { sub: string } },
    @Query('date') date?: string,
  ) {
    return this.tasksService.getDailyView(
      req.user.sub,
      date || new Date().toISOString(),
    );
  }

  @Post()
  create(@Req() req: { user: { sub: string } }, @Body() body: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, body);
  }

  @Patch(':id')
  update(
    @Req() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.user.sub, id, body);
  }

  @Delete(':id')
  remove(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.tasksService.remove(req.user.sub, id);
  }
}
