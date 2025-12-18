import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from './tode.dto';


@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTodoDto) {
    try {
      return await this.todoService.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() query: TodoQueryDto) {
    try {
      return await this.todoService.findAll(query);
    } catch (error) {
      throw error;
    }
  }

  @Get('stats')
  async getStats() {
    try {
      return await this.todoService.getStats();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.todoService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    try {
      return await this.todoService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/complete')
  async markComplete(@Param('id') id: string) {
    try {
      return await this.todoService.markComplete(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      return await this.todoService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  @Post('cleanup')
  async cleanupExpired() {
    try {
      return await this.todoService.cleanupExpired();
    } catch (error) {
      throw error;
    }
  }
}