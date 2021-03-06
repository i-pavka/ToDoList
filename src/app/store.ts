import {combineReducers} from 'redux';
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {tasksReducer} from "../components/Todolist/Task/tasks-reducer";
import {todoListsReducer} from "../components/Todolist/todolists-reducer";
import {loginReducer} from "../components/Login/login-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  login: loginReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});
export type AppRootStateType = ReturnType<typeof rootReducer>
// export type AppRootStateType = ReturnType<typeof store.getState> // вариант из доки Redux
export type AppDispatchType = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatchType>();

// @ts-ignore
window.store = store;
