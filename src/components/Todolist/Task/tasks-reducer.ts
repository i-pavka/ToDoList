import {Dispatch} from "redux";
import {TasksStateType} from "../../../app/App";
import {taskAPI, TaskStatuses, TaskType, TodoListType, UpdateTaskModelType} from "../../../api/todolists-api";
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
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTaskAC: (state, action: PayloadAction<{ taskID: string, todoListID: string }>) => {
      // my
      const index = state[action.payload.todoListID].findIndex(el => el.id === action.payload.taskID);
      state[action.payload.todoListID].splice(index, 1);
      // Dim
      // const tasks = state[action.payload.todoListID];
      // const index = tasks.findIndex(el => el.id === action.payload.taskID);
      // if (index !== -1) tasks.splice(index, 1);
    },
    addTaskAC: (state, action: PayloadAction<{ item: TaskType }>) => {
      state[action.payload.item.todoListId].unshift(action.payload.item)
    },
    changeTaskStatusAC: (
      state, action: PayloadAction<{ todoListID: string, taskID: string, status: TaskStatuses }>
    ) => {
      const tasks = state[action.payload.todoListID];
      const index = tasks.findIndex(el => el.id === action.payload.taskID);
      if (index !== -1) tasks[index].status = action.payload.status;

    },
    changeTaskTitleAC: (
      state, action: PayloadAction<{ taskID: string, title: string, todoListID: string }>
    ) => {
      const tasks = state[action.payload.todoListID];
      const index = tasks.findIndex(el => el.id === action.payload.taskID);
      if (index !== -1) tasks[index].title = action.payload.title;
    },
    fetchTasksAC: (state, action: PayloadAction<{ todoID: string, tasks: TaskType[] }>) => {
      state[action.payload.todoID] = action.payload.tasks;
    },
  },
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
  }
})

export const tasksReducer = slice.reducer;
export const {
  removeTaskAC,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  fetchTasksAC,
} = slice.actions;


// Thunk
export const fetchTasksTC = (todoID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    taskAPI.getTasks(todoID)
      .then(res => {
        dispatch(fetchTasksAC({todoID, tasks: res.items}))
        dispatch(setAppStatusAC({status: 'succeeded'}));
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const addTaskTC = (todoID: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    taskAPI.createTask(todoID, title)
      .then(res => {
        console.log(res)
        if (res.resultCode === ResultCodeStatuses.success) {
          dispatch(addTaskAC({item: res.data.item}))
          dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
          handleServerAppError(res, dispatch);
        }
      }).catch((rej: AxiosError) => {
      console.log('catch')
      console.log(rej)
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const removeTaskTC = (taskID: string, todoID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC({status: 'loading', todoListID: todoID}));
    dispatch(setAppStatusAC({status: 'loading'}));
    taskAPI.deleteTask(todoID, taskID)
      .then(res => {
        dispatch(changeTodolistEntityStatusAC({status: 'idle', todoListID: todoID}));
        dispatch(removeTaskAC({taskID, todoListID: todoID}));
        dispatch(setAppStatusAC({status: 'succeeded'}));
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const updateTaskTitleTC = (taskID: string, title: string, todoID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    taskAPI.updateTaskTitle(todoID, taskID, title)
      .then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
          dispatch(changeTaskTitleAC({taskID, title, todoListID: todoID}))
          dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
          handleServerAppError(res, dispatch);
        }
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const changeTaskStatusTC = (todoID: string, taskID: string, status: TaskStatuses) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const allAppTask = state.tasks;
    const tasksForClickedTodo = allAppTask[todoID]
    const currentTask = tasksForClickedTodo.find(el => {
      return el.id === taskID
    })

    if (currentTask) {
      const model: UpdateTaskModelType = {
        title: currentTask.title,
        status,
        description: currentTask.description,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        deadline: currentTask.deadline,
      }
      taskAPI.updateTaskStatus(todoID, taskID, model)
        .then(res => {
          dispatch(changeTaskStatusAC({todoListID: todoID, taskID, status}))
        }).catch((rej: AxiosError) => {
        handleServerNetworkError(rej.message, dispatch)
      })
    }
  }
}

// types
export type TaskActionsType = ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof fetchTasksAC>
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodosActionType
  | ClearDataActionType
