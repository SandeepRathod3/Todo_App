import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './tode.dto';

@Controller('todo')
export class TodoController {
    constructor( private readonly TodoService: TodoService){}

    @Post()
    create(@Body()dto:CreateTodoDto){
        return this.TodoService.createTodo(dto)
    }
    @Get()
    findAll(){
        return this.TodoService.getAllTodo();
    }

    @Patch(':id/status/:status')
    updateStatus(
        @Param('id') id:string,
        @Param('status') status:string
    ){
        return this.TodoService.updateStatus(id, status)
    }

    @Delete(':id')
    delete(@Param('id') id:string) {
        return this.TodoService.deleteTodo(id)
    }
  }

