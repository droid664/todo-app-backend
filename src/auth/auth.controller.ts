import { Body, ConflictException, Controller, Post, UseGuards, Request, Get } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDTO } from 'src/user/dto/createUser.dto'
import { UserService } from 'src/user/user.service'
import { IPayloadUser } from './types/payload.interface'
import { LocalAuthGuard } from './guards/local.guard'
import { IUser } from './types/user.interface'
import { AuthService } from './auth.service'
import { ITokens } from './types/tokens.interface'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { TokenDTO } from './dto/token.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDTO): Promise<Pick<ITokens, 'access_token'>> {
    const findUser = await this.userService.findUserByEmail(dto.email)

    if (findUser) {
      throw new ConflictException(`User with email ${dto.email} already exists`)
    }

    const user = await this.userService.save(dto)

    const payload: IPayloadUser = {
      id: user.id,
      email: user.email,
    }

    const access_token = this.jwtService.sign(payload)

    return { access_token }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<ITokens> {
    return await this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req): Promise<IUser & Pick<ITokens, 'access_token'>> {
    const { email } = req.user

    const findUser = await this.userService.findUserByEmail(email)

    delete findUser.password

    const payload: IPayloadUser = {
      id: findUser.id,
      email: findUser.email,
    }

    const access_token = this.jwtService.sign(payload)

    return {
      ...findUser,
      access_token,
    }
  }

  @Post('/refresh')
  async refreshToken(@Body() dto: TokenDTO): Promise<any> {
    return await this.authService.generateRefreshToken(dto.token)
  }
}
