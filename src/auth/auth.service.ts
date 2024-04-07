import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { compare } from 'bcrypt'
import { IUser } from './types/user.interface'
import { IPayloadUser } from './types/payload.interface'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ITokens } from './types/tokens.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email)

    if (user && (await compare(password, user.password))) {
      const result = user

      delete result.password

      return result
    }

    return null
  }

  async login(user: IUser): Promise<{ access_token: string; refresh_token: string }> {
    const payload: IPayloadUser = {
      id: user.id,
      email: user.email,
    }

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { email: payload.email },
        {
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES') + 'd',
        },
      ),
    }
  }

  async generateRefreshToken(token: string): Promise<Pick<ITokens, 'access_token'>> {
    const isExpired = this.isTokenExpired(token)

    if (!isExpired) {
      const { email } = this.jwtService.decode(token)

      const user = await this.userService.findUserByEmail(email)

      const payload: IPayloadUser = {
        id: user.id,
        email: user.email,
      }

      return {
        access_token: this.jwtService.sign(payload),
      }
    } else {
      throw new UnauthorizedException()
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.jwtService.verify(token)
      const expirationDate = decoded.exp * 1000 // Преобразование секунд в миллисекунды
      const currentDate = new Date().getTime()
      return currentDate > expirationDate
    } catch (e) {
      return true // Если токен недействителен, считаем его просроченным
    }
  }
}
