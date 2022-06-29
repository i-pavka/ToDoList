import {v1} from 'uuid';
import {todoListAPI, TodoListType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const todoListId1 = v1();
export const todoListId2 = v1();

export enum ResultCodeStatuses {
  success = 0,
  error = 1,
  captcha = 10,
}

const initialState: TodoListDomainType[] = []

const slice = createSlice({
  name: 'todoLists',
  initialState,
  reducers: {
    removeTodoListAC: (state, action: PayloadAction<{ todoListID: string }>) => {
      const index = state.findIndex(el => el.id === action.payload.todoListID);
      if (index !== -1) state.splice(index, 1)
    },
    addTodolistAC: (state, action: PayloadAction<{ item: TodoListType }>) => {
      state.unshift({...action.payload.item, filter: "all", entityStatus: 'idle'})
    },
    changeTodoListTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const index = state.findIndex(el => el.id === action.payload.id);
      state[index].title = action.payload.title;
    },
    changeTodolistFilterAC: (
      state, action: PayloadAction<{ id: string, filter: FilterValuesType }>
    ) => {
      const index = state.findIndex(el => el.id === action.payload.id);
      state[index].filter = action.payload.filter;

    },
    setTodosAC: (state, action: PayloadAction<{ todos: TodoListType[] }>) => {
      return action.payload.todos.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
    },
    changeTodolistEntityStatusAC: (
      state, action: PayloadAction<{ status: RequestStatusType, todoListID: string }>
    ) => {
      const index = state.findIndex(el => el.id === action.payload.todoListID);
      state[index].entityStatus = action.payload.status;

    },
    clearTodosDataAC: () => {
      return []
    },
  }
})

export const todoListsReducer = slice.reducer;
export const {
  removeTodoListAC,
  addTodolistAC,
  changeTodoListTitleAC,
  changeTodolistFilterAC,
  setTodosAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
} = slice.actions;


// Thunk
export const fetchTodosTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todoListAPI.getTodoLists()
      .then(res => {
        dispatch(setTodosAC({todos: res}));
        dispatch(setAppStatusAC({status: 'succeeded'}));
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}));
  todoListAPI.createTodoList(title)
    .then(res => {
      if (res.resultCode === ResultCodeStatuses.success) {
        dispatch(addTodolistAC({item: res.data.item}));
        dispatch(setAppStatusAC({status: 'succeeded'}));
      } else {
        handleServerAppError(res, dispatch);
      }
    }).catch((rej: AxiosError) => {
    handleServerNetworkError(rej.message, dispatch);
  })
}
export const removeTodoListTC = (todoListID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({status: 'loading', todoListID}));
    todoListAPI.deleteTodoList(todoListID)
      .then(res => {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        dispatch(removeTodoListAC({todoListID}));
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}
export const updateTodoListTitleTC = (todoListID: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todoListAPI.updateTodoListTitle(todoListID, title)
      .then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
          dispatch(changeTodoListTitleAC({id: todoListID, title}));
          dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
          handleServerAppError(res, dispatch);
        }
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export type SetTodosActionType = ReturnType<typeof setTodosAC>
export type ChangeTodolistEntityType = ReturnType<typeof changeTodolistEntityStatusAC>
export type ClearDataActionType = ReturnType<typeof clearTodosDataAC>
export type TodoListActionsType = RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodosActionType
  | ChangeTodolistEntityType
  | ClearDataActionType
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
