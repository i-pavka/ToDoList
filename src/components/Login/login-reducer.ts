import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearTodosDataAC, ResultCodeStatuses} from "../Todolist/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


// Thunk
export const authLogInTC = createAsyncThunk<undefined, LoginParamsType,
  { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }>(
  'login/authLogIn', async (data: LoginParamsType,
                            {
                              dispatch,
                              rejectWithValue,
                            }) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await authAPI.login(data);
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return
      } else {
        handleServerAppError(response, dispatch);
        return rejectWithValue({errors: response.messages, fieldsErrors: response.fieldsErrors});
      }
    } catch (e) {
      const error = e as AxiosError;
      handleServerNetworkError(error.message, dispatch);
      return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }
  }
)

export const logoutTC = createAsyncThunk(
  'login/logout', async (param, {dispatch, rejectWithValue,}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
      const response = await authAPI.logout();
      if (response.resultCode === ResultCodeStatuses.success) {
        dispatch(setAppStatusAC({status: 'succeeded'}));
        dispatch(clearTodosDataAC());
        return;
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

// Slice
const slice = createSlice({
  name: 'login',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    }
  },
  extraReducers: builder => {
    builder.addCase(authLogInTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    })
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    })
  }
})

export const loginReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

