import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  DefaultValuePipe,
  ParseEnumPipe,
  ParseIntPipe,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/user/decorators/user.decorator'
import { Sort } from './types/sort.enum'
import { Direction } from 'src/shared/types/enum/direction.enum'
import { IDataTodos } from './types/data.interface'
import { UpdateTodoDTO } from './dto/update.dto'
import { TodoEntity } from './todos.entity'

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
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page,
    @Query('pageSize', new DefaultValuePipe(1), new ParseIntPipe()) pageSize,
  ): Promise<IDataTodos> {
    return await this.todosService.findAll(userId, sort, direction, { pageSize, page })
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOne(@User('id') userId, @Param('id', new ParseUUIDPipe()) todoId): Promise<TodoEntity> {
    return await this.todosService.findOne(userId, todoId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTodo(@Param('id', new ParseUUIDPipe()) id): Promise<{ message: string }> {
    return await this.todosService.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateTodo(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTodoDTO) {
    return await this.todosService.update(id, dto)
  }
}
