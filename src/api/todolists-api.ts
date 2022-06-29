import axios, {AxiosResponse} from "axios";
import {apiConfig} from "../utils/config";

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    'API-KEY': apiConfig.NETWORK_KEY as string
  },
})
const placeholderInst = axios.create({
  withCredentials: true,
  baseURL: "https://jsonplaceholder.typicode.com/",

})

export const todoListAPI = {
  getTodoLists() {
    return instance.get<TodoListType[]>(`todo-lists`)
      .then(res => res.data)
  },
  createTodoList(title: string) {
    return instance.post<any, AxiosResponse<ResponseType<{ item: TodoListType }>>, { title: string }>(`todo-lists`,
      {title: title})
      .then(res => res.data)
  },
  deleteTodoList(todoID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoID}`)
      .then(res => res.data)
  },
  updateTodoListTitle(todoID: string, title: string) {
    return instance.put<any, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${todoID}`, {title: title})
      .then(res => res.data)
  },

}
export const taskAPI = {
  getTasks(todoListId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todoListId}/tasks`)
      .then(res => res.data)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<any, AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>
    (`todo-lists/${todolistId}/tasks`, {title})
      .then(res => res.data)
  },
  updateTaskTitle(todoID: string, taskID: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`, {title: title})
      .then(res => res.data)
  },
  _updateTaskStatus(todoID: string, taskID: string, status: TaskStatuses, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`, {title, status})
      .then(res => res.data)
  },
  updateTaskStatus(todoID: string, taskID: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType>(`todo-lists/${todoID}/tasks/${taskID}`, model)
      .then(res => res.data)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
      .then(res => res.data)
  },

}

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>
    (`/auth/login`, data)
      .then(res => res.data);
  },
  authMe() {
    return instance.get<ResponseType<MeResponseType>>('auth/me')
      .then(res => res.data);
  },
  logout: function () {
    return instance.delete<ResponseType>('auth/login')
      .then(res => res.data);
  }
}

export const titleToDoListAPI = { // random title name
  getTitle(value: number) {
    return placeholderInst.get<PlaceHolderType[]>(`todos?_start=${value}&_limit=1`)
      .then(res => res.data)
  },
}

// types
type PlaceHolderType = {
  userId: number
  id: number
  title: string
  completed: boolean
}
type MeResponseType = {
  id: number
  email: string
  login: string
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type TodoListType = {
  id: string
  addedDate: string
  order: number
  title: string
}
export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}
export type ResponseType<D = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors?: string[]
  data: D
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}