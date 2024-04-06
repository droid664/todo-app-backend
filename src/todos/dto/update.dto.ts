import { IsArray, IsOptional } from 'class-validator'

export class UpdateTodoDTO {
  title?: string
  description?: string
  cover?: number
  pin?: boolean
  files?: number[]
}
