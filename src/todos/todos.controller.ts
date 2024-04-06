import { Controller, Post, UseGuards } from '@nestjs/common'
import { TodosService } from './todos.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/user/decorators/user.decorator'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createTodo(@User('id') userId): Promise<any> {
    return this.todosService.save(userId)
  }
}
