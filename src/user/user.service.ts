import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { CreateUserDTO } from './dto/createUser.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(dto: CreateUserDTO): Promise<UserEntity> {
    const newUser = await this.userRepository.create(dto)

    return await this.userRepository.save(newUser)
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } })
  }

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } })
  }
}
