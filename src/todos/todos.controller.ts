import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  DefaultValuePipe,
  ParseEnumPipe,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/user/decorators/user.decorator'
import { Sort } from './types/sort.enum'
import { Direction } from 'src/shared/types/enum/direction.enum'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createTodo(@User('id') userId): Promise<any> {
    return this.todosService.save(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll(
    @User('id') userId,
    @Query('sort', new DefaultValuePipe(Sort.updatedAt), new ParseEnumPipe(Sort)) sort,
    @Query('direction', new DefaultValuePipe(Direction.DESC), new ParseEnumPipe(Direction))
    direction,
  ): Promise<any> {
    return await this.todosService.findAll(userId, sort, direction)
  }
}
