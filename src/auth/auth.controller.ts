import { Body, ConflictException, Controller, Post, UseGuards, Request } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDTO } from 'src/user/dto/createUser.dto'
import { UserService } from 'src/user/user.service'
import { IPayloadUser } from './types/payload.interface'
import { LocalAuthGuard } from './guards/local.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDTO): Promise<{ access_token: string }> {
    const findUser = await this.userService.findUserByEmail(dto.email)

    if (findUser) {
      throw new ConflictException(`User with email ${dto.email} already exists`)
    }

    const user = await this.userService.save(dto)

    const payload: IPayloadUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
    }

    const access_token = this.jwtService.sign(payload)

    return { access_token }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return req.user
  }
}
