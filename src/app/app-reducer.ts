import {authAPI} from "../api/todolists-api";
import {ResultCodeStatuses} from "../components/Todolist/todolists-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedInAC} from "../components/Login/login-reducer";

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppInitializedAC: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized =  action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer;
export const {
    setAppStatusAC,
    setAppErrorAC,
    setAppInitializedAC
} = slice.actions;


// Thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    authAPI.authMe().then(res => {
        if (res.resultCode === ResultCodeStatuses.success) {
            dispatch(setIsLoggedInAC({value: true}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res, dispatch);
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    }).finally(() => dispatch(setAppInitializedAC({isInitialized: true})));
}
