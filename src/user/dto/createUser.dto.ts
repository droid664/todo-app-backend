import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { validationMessages } from 'src/constants/validation/messages'

export class CreateUserDTO {
  @IsNotEmpty({ message: validationMessages.required })
  name: string

  @IsNotEmpty({ message: validationMessages.required })
  surname: string

  @IsEmail({}, { message: validationMessages.email })
  @IsNotEmpty({ message: validationMessages.required })
  email: string

  @MinLength(6, { message: validationMessages.minLength })
  @IsNotEmpty({ message: validationMessages.required })
  password: string
}
