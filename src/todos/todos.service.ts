import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TodoEntity } from './todos.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sort } from './types/sort.enum'
import { Direction } from 'src/shared/types/enum/direction.enum'

@Injectable()
export class TodosService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(TodoEntity) private readonly todosRepository: Repository<TodoEntity>,
  ) {}
  async save(userId: number): Promise<TodoEntity> {
    const user = await this.userService.findOneById(userId)

    const newTodo = new TodoEntity()

    // TODO: указываем автора заметки
    newTodo.user = user

    const createdTodo = await this.todosRepository.create(newTodo)
    const saved = await this.todosRepository.save(createdTodo)

    delete saved.user

    return saved
  }

  async findAll(userId: number, sort: Sort, direction: Direction) {
    const queryBuilder = this.todosRepository
      .createQueryBuilder('todos')
      .andWhere('todos.user.id = :userId', { userId })
      .orderBy(`todos.${sort}`, direction)

    return await queryBuilder.getMany()
  }
}
