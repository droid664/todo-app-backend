import { IDataResponse } from 'src/shared/types/interface/response/response.data.interface'
import { TodoEntity } from '../todos.entity'

export interface IDataTodos extends IDataResponse {
  data: TodoEntity[]
}
