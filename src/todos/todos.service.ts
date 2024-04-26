import { Injectable, NotFoundException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TodoEntity } from './todos.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sort } from './types/sort.enum'
import { Direction } from 'src/shared/types/enum/direction.enum'
import { IPagination } from 'src/shared/types/interface/pagination.interface'
import { IDataTodos } from './types/data.interface'
import { UpdateTodoDTO } from './dto/update.dto'
import { FilesService } from 'src/files/files.service'

@Injectable()
export class TodosService {
  constructor(
    private readonly userService: UserService,
    private readonly filesService: FilesService,
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

    return await this.findOneById(saved.id)
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

  async findOne(userId: number, todoId: string): Promise<TodoEntity> {
    const queryBuilder = this.todosRepository
      .createQueryBuilder('todo')
      .andWhere('todo.id = :todoId', { todoId })
      .leftJoinAndSelect('todo.cover', 'cover')
      .andWhere('todo.user.id = :userId', { userId })

    return await queryBuilder.getOne()
  }

  async findOneById(id: string): Promise<TodoEntity> {
    return await this.todosRepository.findOne({
      where: { id },
      relations: ['cover', 'files'],
    })
  }

  async delete(id: string): Promise<{
    message: string
  }> {
    const findTodo = await this.findOneById(id)

    if (!findTodo) {
      throw new NotFoundException('Заметка не найдена!')
    }

    await this.todosRepository.delete(id)

    return {
      message: 'Заметка успешно удалена!',
    }
  }

  async update(id: string, dto: UpdateTodoDTO): Promise<TodoEntity> {
    const findTodo = await this.findOneById(id)

    if (!findTodo) {
      throw new NotFoundException('Заметка не найдена!')
    }

    const updateTodo: TodoEntity = Object.assign(findTodo, dto)

    // Обновляем файлы
    if (dto.files) {
      updateTodo.files = await this.filesService.findByIds(dto.files)
    }

    if (dto.cover) {
      updateTodo.cover = await this.filesService.findOneById(dto.cover)
    }

    return await this.todosRepository.save(updateTodo)
  }
}
