
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type TodoDocument=Todo & Document
@Schema({timestamps:true})
export class Todo {
    @Prop({required: true})
    title:string;

    @Prop()
    description:string;

    @Prop({enum:['pending', 'completed']})
    status: string;

}

export const TodoSchema=SchemaFactory.createForClass(Todo)
