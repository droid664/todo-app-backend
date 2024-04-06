import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { UserModule } from 'src/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoEntity } from './todos.entity'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
