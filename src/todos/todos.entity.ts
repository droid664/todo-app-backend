import { FileEntity } from 'src/files/files.entity'
import { UserEntity } from 'src/user/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: '' })
  title: string

  @Column({ default: '' })
  description: string

  @OneToMany(() => FileEntity, (file) => file.todo)
  files: FileEntity[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => UserEntity, (user) => user.todos)
  user: UserEntity
}
