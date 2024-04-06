import { Controller, Post } from '@nestjs/common'
import { TodosService } from './todos.service'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('/create')
  async createTodo(): Promise<any> {
    return this.todosService.save()
  }
}
