import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileEntity } from './files.entity'
import { In, Repository } from 'typeorm'
import { CreateFileDTO } from './dto/createFile.dto'

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private readonly filesRepository: Repository<FileEntity>,
  ) {}

  async save(dto: CreateFileDTO[]) {
    const promises: Promise<FileEntity>[] = []

    for (const item of dto) {
      promises.push(this.filesRepository.save(item))
    }

    return Promise.all(promises)
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
