import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IPayloadUser } from 'src/auth/types/payload.interface'

type UserDecorator = keyof IPayloadUser

export const User = createParamDecorator((data: Partial<UserDecorator>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return data ? request.user[data] : request.user
})
