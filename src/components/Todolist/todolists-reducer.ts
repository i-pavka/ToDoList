import {v1} from 'uuid';
import {todoListAPI, TodoListType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const todoListId1 = v1();
export const todoListId2 = v1();

export enum ResultCodeStatuses {
  success = 0,
  error = 1,
  captcha = 10,
}

// Thunk
export const fetchTodosTC = createAsyncThunk('todoLists/fetchTodos',
  async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await todoListAPI.getTodoLists();
      dispatch(setAppStatusAC({status: 'succeeded'}));
      return {todos: response};
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue(null);
    }
  })

export const addTodoListTC = createAsyncThunk('todoLists/addTodoList',
  async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await todoListAPI.createTodoList(title);
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {item: response.data.item};
      } else {
        handleServerAppError(response, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue(error);
    }
  })

export const removeTodoListTC = createAsyncThunk('todoLists/removeTodoList',
  async (todoListID: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await todoListAPI.deleteTodoList(todoListID);
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todoListID};
      } else {
        handleServerAppError(response, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue(null);
    }
  })

export const updateTodoListTitleTC = createAsyncThunk('todoLists/updateTodoListTitle',
  async (param: { todoListID: string, title: string },
         {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await todoListAPI.updateTodoListTitle(param.todoListID, param.title);
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {id: param.todoListID, title: param.title};
      } else {
        handleServerAppError(response, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue(null);
    }
  })

// Slice
const slice = createSlice({
  name: 'todoLists',
  initialState: [] as TodoListDomainType[],
  reducers: {
    changeTodolistFilterAC: (
      state, action: PayloadAction<{ id: string, filter: FilterValuesType }>
    ) => {
      const index = state.findIndex(el => el.id === action.payload.id);
      state[index].filter = action.payload.filter;
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodosTC.fulfilled, (state, action) => {
        return action.payload.todos.map(el => ({...el, filter: 'all', entityStatus: 'idle'}));
      })
      .addCase(addTodoListTC.fulfilled, (state, action) => {
        state.unshift({...action.payload.item, filter: "all", entityStatus: 'idle'});
      })
      .addCase(removeTodoListTC.fulfilled, (state, action) => {
        const index = state.findIndex(el => el.id === action.payload.todoListID);
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(updateTodoListTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(el => el.id === action.payload.id);
        state[index].title = action.payload.title;
      })
  }
})

export const todoListsReducer = slice.reducer;
export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
} = slice.actions;

// types
export type ChangeTodolistEntityType = ReturnType<typeof changeTodolistEntityStatusAC>
export type ClearDataActionType = ReturnType<typeof clearTodosDataAC>
export type TodoListActionsType =
  | ReturnType<typeof changeTodolistFilterAC>
  | ChangeTodolistEntityType
  | ClearDataActionType
export type FilterValuesType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
