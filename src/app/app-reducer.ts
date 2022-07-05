import {authAPI} from "../api/todolists-api";
import {ResultCodeStatuses} from "../components/Todolist/todolists-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedInAC} from "../components/Login/login-reducer";
import {AxiosError} from "axios";

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false
}

// Thunk
export const initializeAppTC = createAsyncThunk(
  'app/initializeApp', async (param, {dispatch, rejectWithValue,}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await authAPI.authMe();
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        dispatch(setIsLoggedInAC({isLoggedIn: true}));
      } else {
        handleServerAppError(response, dispatch);
        return rejectWithValue({});
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue({});
    }
  }
)


const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    })
  }
})

export const appReducer = slice.reducer;
export const {
  setAppStatusAC,
  setAppErrorAC,
} = slice.actions;
