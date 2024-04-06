import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TodoEntity } from './todos.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sort } from './types/sort.enum'
import { Direction } from 'src/shared/types/enum/direction.enum'
import { IPagination } from 'src/shared/types/interface/pagination.interface'
import { IDataResponse } from 'src/shared/types/interface/response/response.data.interface'
import { IDataTodos } from './types/data.interface'
import { FileEntity } from 'src/files/files.entity'

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

  async findAll(
    userId: number,
    sort: Sort,
    direction: Direction,
    pagination: Omit<IPagination, 'total'>,
  ): Promise<IDataTodos> {
    // Пагинация
    let pageSize = pagination.pageSize
    let page = pagination.page

    pageSize = pageSize <= 0 ? 1 : pageSize
    page = page <= 0 ? 1 : page

    const skip = (pagination.page - 1) * pagination.pageSize

    const queryBuilder = this.todosRepository
      .createQueryBuilder('todos')
      .leftJoinAndSelect('todos.cover', 'cover')
      .leftJoinAndSelect('todos.files', 'files')
      .andWhere('todos.user.id = :userId', { userId })
      .orderBy(`todos.${sort}`, direction)
      .skip(skip)
      .take(pagination.pageSize)

    const todos = await queryBuilder.getMany()
    const total = await queryBuilder.getCount()

    return {
      data: todos,
      meta: {
        page,
        pageSize,
        total,
      },
    }
  }
}
