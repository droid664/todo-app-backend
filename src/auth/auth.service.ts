import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { compare } from 'bcrypt'
import { UserEntity } from 'src/user/user.entity'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email)

    if (user && compare(user.password, password)) {
      const { password, ...result } = user
      return result
    }

    return null
  }
}
