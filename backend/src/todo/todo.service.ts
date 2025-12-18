import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument, TodoStatus } from './tode.schema';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from './tode.dto';
import { ApiResponseDto, PaginatedData } from 'src/common/api-response.interface';




@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<ApiResponseDto<Todo>> {
    try {
      const expiryDate = createTodoDto.expiryDate || 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      if (expiryDate < new Date()) {
        throw new BadRequestException('Expiry date cannot be in the past');
      }

      const todo = new this.todoModel({
        ...createTodoDto,
        expiryDate,
      });

      const savedTodo = await todo.save();
      return ApiResponseDto.success(savedTodo, 'Todo created successfully');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create todo');
    }
  }

  async findAll(query: TodoQueryDto): Promise<ApiResponseDto<PaginatedData<Todo>>> {
    try {
      const { page=1, limit=10, status, search,  } = query;
      const skip = (page - 1) * limit;

      const filter: any = { isDeleted: false };

      if (status) filter.status = status;
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }


      const [data, total] = await Promise.all([
        this.todoModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.todoModel.countDocuments(filter),
      ]);

      const result: PaginatedData<Todo> = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return ApiResponseDto.success(result, 'Todos retrieved successfully');
    } catch (error) {
      throw new BadRequestException('Failed to fetch todos');
    }
  }

  async findOne(id: string): Promise<ApiResponseDto<Todo>> {
    try {
      const todo = await this.todoModel.findOne({ 
        _id: id, 
        isDeleted: false 
      }).lean();

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      return ApiResponseDto.success(todo, 'Todo retrieved successfully');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch todo');
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<ApiResponseDto<Todo>> {
    try {
      if (updateTodoDto.expiryDate && updateTodoDto.expiryDate < new Date()) {
        throw new BadRequestException('Expiry date cannot be in the past');
      }

      const todo = await this.todoModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateTodoDto },
        { new: true, runValidators: true },
      ).lean();

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      return ApiResponseDto.success(todo, 'Todo updated successfully');
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update todo');
    }
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    try {
      const todo = await this.todoModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true },
      );

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      return ApiResponseDto.success(null, 'Todo deleted successfully');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete todo');
    }
  }

  async markComplete(id: string): Promise<ApiResponseDto<Todo>> {
    try {
      const todo = await this.todoModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { 
          $set: { 
            status: TodoStatus.COMPLETED,
            completedAt: new Date()
          } 
        },
        { new: true },
      ).lean();

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      return ApiResponseDto.success(todo, 'Todo marked as completed');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to mark todo as completed');
    }
  }

  async getStats(): Promise<ApiResponseDto<any>> {
    try {
      const now = new Date();
      
      const [total, pending, completed, overdue] = await Promise.all([
        this.todoModel.countDocuments({ isDeleted: false }),
        this.todoModel.countDocuments({ 
          status: TodoStatus.PENDING, 
          isDeleted: false 
        }),
        this.todoModel.countDocuments({ 
          status: TodoStatus.COMPLETED, 
          isDeleted: false 
        }),
        this.todoModel.countDocuments({ 
          status: TodoStatus.PENDING, 
          expiryDate: { $lt: now },
          isDeleted: false 
        }),
      ]);

      const stats = {
        total,
        pending,
        completed,
        overdue,
        completionRate: total > 0 ? (completed / total * 100).toFixed(2) : 0,
      };

      return ApiResponseDto.success(stats, 'Stats retrieved successfully');
    } catch (error) {
      throw new BadRequestException('Failed to fetch stats');
    }
  }

  async cleanupExpired(): Promise<ApiResponseDto<{ deletedCount: number }>> {
    try {
      const result = await this.todoModel.updateMany(
        { 
          status: TodoStatus.PENDING,
          expiryDate: { $lt: new Date() },
          isDeleted: false 
        },
        { $set: { isDeleted: true } }
      );
      
      const response = { deletedCount: result.modifiedCount };
      return ApiResponseDto.success(response, 'Expired todos cleaned up successfully');
    } catch (error) {
      throw new BadRequestException('Failed to cleanup expired todos');
    }
  }
}