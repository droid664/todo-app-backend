import { IsNotEmpty, IsString } from 'class-validator'
import { validationMessages } from 'src/constants/validation/messages'

export class TokenDTO {
  @IsString({
    message: validationMessages.isString,
  })
  @IsNotEmpty({ message: validationMessages.required })
  token: string
}
