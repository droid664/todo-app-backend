import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileEntity } from './files.entity'
import { Repository } from 'typeorm'
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
}
