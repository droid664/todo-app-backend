import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileEntity } from './files.entity'
import { In, Repository, EntityManager } from 'typeorm'
import { CreateFileDTO } from './dto/createFile.dto'
import { EntityDataDTO } from './dto/entityData.dto'
import { TodoEntity } from 'src/todos/todos.entity'

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private readonly filesRepository: Repository<FileEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async save(dto: CreateFileDTO[], entityData: EntityDataDTO) {
    const promises: Promise<FileEntity>[] = []

    for (const item of dto) {
      promises.push(this.filesRepository.save(item))
    }

    const files = await Promise.all(promises)

    // TODO: если указаны все необходимые поля, то прикрепляем файл(ы) к entity
    if (entityData.entityField && entityData.entityId && entityData.entityName) {
      const repository = await this.entityManager.getRepository(entityData.entityName)

      if (!repository) {
        return
      }

      const entity = await repository.findOne({
        where: { id: entityData.entityId },
        relations: [entityData.entityField],
      })

      if (!entity) {
        return
      }

      entity[entityData.entityField] = [...entity[entityData.entityField], ...files]

      await repository.save(entity)
    }

    return files
  }

  async findOne(filename: string): Promise<FileEntity> {
    return await this.filesRepository.findOne({ where: { filename } })
  }

  async findOneById(id: number): Promise<FileEntity> {
    return await this.filesRepository.findOne({ where: { id } })
  }

  async findByIds(ids: number[]): Promise<FileEntity[]> {
    return await this.filesRepository.findBy({ id: In(ids) })
  }

  async deleteFile(id: number) {
    return await this.filesRepository.delete(id)
  }
}
