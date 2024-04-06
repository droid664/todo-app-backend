import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TodoEntity } from './todos.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

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
}
