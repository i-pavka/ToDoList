import {TasksStateType} from "../../../app/App";
import {taskAPI, TaskStatuses, TodoListType, UpdateTaskModelType} from "../../../api/todolists-api";
import {AppRootStateType} from "../../../app/store";
import {
  addTodolistAC,
  AddTodolistActionType,
  changeTodolistEntityStatusAC, ClearDataActionType, removeTodoListAC,
  RemoveTodolistActionType, ResultCodeStatuses, setTodosAC,
  SetTodosActionType
} from "../todolists-reducer";
import {setAppStatusAC} from "../../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

// Thunk
export const fetchTasksTC = createAsyncThunk(
  'tasks/fetchTasks', async (todoID: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await taskAPI.getTasks(todoID);
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
      return {todoID, tasks: response.items};
    } catch (e) {
      const error = e as AxiosError
      handleServerNetworkError(error.message, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const addTaskTC = createAsyncThunk(
  'tasks/addTask', async (
    param: { todoID: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await taskAPI.createTask(param.todoID, param.title);
      if (response.resultCode === ResultCodeStatuses.success) {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        return {item: response.data.item};
      } else {
        handleServerAppError(response, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error);
    }
  })

export const removeTaskTC = createAsyncThunk(
  'tasks/removeTask', async (
    param: { taskID: string, todoID: string }, thunkAPI) => {
    thunkAPI.dispatch(changeTodolistEntityStatusAC({status: 'loading', todoListID: param.todoID}));
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      await taskAPI.deleteTask(param.todoID, param.taskID);
      thunkAPI.dispatch(changeTodolistEntityStatusAC({status: 'idle', todoListID: param.todoID}));
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
      return {taskID: param.taskID, todoListID: param.todoID};
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error);
    }
  })

export const updateTaskTitleTC = createAsyncThunk(
  'tasks/updateTaskTitle', async (
    param: { taskID: string, title: string, todoID: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await taskAPI.updateTaskTitle(param.todoID, param.taskID, param.title);
      if (response.resultCode === ResultCodeStatuses.success) {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        return {taskID: param.taskID, title: param.title, todoListID: param.todoID};
      } else {
        handleServerAppError(response, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error);
    }
  })

export const changeTaskStatusTC = createAsyncThunk(
  'tasks/changeTaskStatus', async (
    param: { todoID: string, taskID: string, status: TaskStatuses }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const allAppTask = state.tasks;
    const tasksForClickedTodo = allAppTask[param.todoID]
    const currentTask = tasksForClickedTodo.find(el => {
      return el.id === param.taskID
    })

    if (currentTask) {
      const model: UpdateTaskModelType = {
        title: currentTask.title,
        status: param.status,
        description: currentTask.description,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        deadline: currentTask.deadline,
      }
      try {
        await taskAPI.updateTaskStatus(param.todoID, param.taskID, model);
        return {todoListID: param.todoID, taskID: param.taskID, status: param.status};
      } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(error);
      }
    } else return thunkAPI.rejectWithValue("Task not found in state");
  })

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTodolistAC, (state, action) => {
        state[action.payload.item.id] = []
      })
      .addCase(removeTodoListAC, (state, action) => {
        delete state[action.payload.todoListID]
      })
      .addCase(setTodosAC, (state, action) => {
        action.payload.todos.forEach((el: TodoListType) => {
          state[el.id] = []
        })
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todoID] = action.payload.tasks;
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.item.todoListId].unshift(action.payload.item);
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const index = state[action.payload.todoListID].findIndex(el => el.id === action.payload.taskID);
        state[action.payload.todoListID].splice(index, 1);
      })
      .addCase(updateTaskTitleTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListID];
        const index = tasks.findIndex(el => el.id === action.payload.taskID);
        if (index !== -1) tasks[index].title = action.payload.title;
      })
      .addCase(changeTaskStatusTC.fulfilled, (state, action) => {
          const tasks = state[action.payload.todoListID];
          const index = tasks.findIndex(el => el.id === action.payload.taskID);
          if (index !== -1) tasks[index].status = action.payload.status;
      })
  }
})

export const tasksReducer = slice.reducer;

// types
export type TaskActionsType = AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodosActionType
  | ClearDataActionType
