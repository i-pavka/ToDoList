import { Dispatch } from 'redux';
import { ResponseType } from '../api/todolists-api';
import {setAppErrorAC, setAppStatusAC,} from "../app/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch ) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}
export const handleServerNetworkError = (message: string, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}
