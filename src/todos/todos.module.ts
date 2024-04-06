import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { UserModule } from 'src/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoEntity } from './todos.entity'
import { FilesModule } from 'src/files/files.module'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TodoEntity]), FilesModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
