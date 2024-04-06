import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'
import { validationMessages } from 'src/constants/validation/messages'

export class UpdateTodoDTO {
  @IsString({
    message: validationMessages.isString,
  })
  @IsOptional()
  title?: string

  @IsString({
    message: validationMessages.isString,
  })
  @IsOptional()
  description?: string

  @IsInt({
    message: validationMessages.isInteger,
  })
  @IsOptional()
  cover?: number

  @IsBoolean({ message: validationMessages.isBoolean })
  @IsOptional()
  pin?: boolean

  @IsArray({
    message: validationMessages.isArray,
  })
  @IsOptional()
  files?: number[]
}
