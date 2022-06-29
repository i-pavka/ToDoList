import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearTodosDataAC, ResultCodeStatuses} from "../Todolist/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

const initialState = {
  isLoggedIn: false
}

const slice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{value: boolean}>) => {
      state.isLoggedIn = action.payload.value;
    }
  }
})

export const loginReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// Thunk
export const authLogInTC = (data: LoginParamsType) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    authAPI.login(data)
      .then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
          dispatch(setIsLoggedInAC({value: true}));
          dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
          handleServerAppError(res, dispatch);
        }
      }).catch((rej: AxiosError) => {
      handleServerNetworkError(rej.message, dispatch);
    })
  }
}

export const logoutTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
      .then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
          dispatch(setIsLoggedInAC({value: false}));
          dispatch(setAppStatusAC({status: 'succeeded'}));
          dispatch(clearTodosDataAC());
        } else {
          handleServerAppError(res, dispatch)
        }
      })
      .catch((rej: AxiosError) => {
        handleServerNetworkError(rej.message, dispatch)
      })
  }
}



