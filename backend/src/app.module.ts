import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot(
  "  process.env.MONGOURI"
    ),
    TodoModule


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
