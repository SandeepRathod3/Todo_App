import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoDocument = Todo & Document;

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',

}

@Schema({
  timestamps: true
})
export class Todo {

  @Prop({ required: true, minlength: 3, maxlength: 255 })
  title: string;

  @Prop({ maxlength: 1000 })
  description?: string;

  @Prop({ enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.index({ expiryDate: 1 });
TodoSchema.index({ isDeleted: 1 });