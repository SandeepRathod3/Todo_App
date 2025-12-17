import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo,TodoDocument } from './tode.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './tode.dto';
import { promises } from 'dns';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name)
        private todoModel: Model<TodoDocument>
    ){}

    async createTodo(dto:CreateTodoDto): Promise<Todo>{
        const todo=new this.todoModel(dto)
        return todo.save()
    }

    async getAllTodo(): Promise<Todo[]>{
       return this.todoModel.find().sort({createdAt:-1})
    }
    
    async updateStatus(id:string, status:string):Promise<Todo | null>{
        return this.todoModel.findByIdAndUpdate(
             id,
            {status},
            {new:true}
        );
    }

    async deleteTodo(id:string): Promise<void>{
        await this.todoModel.findByIdAndDelete(id)
    }

}
