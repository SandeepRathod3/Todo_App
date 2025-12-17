import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './tode.schema';

@Module({
  imports:[
  MongooseModule.forFeature([{name:Todo.name, schema:TodoSchema}])
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
