import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {TaskType} from "../api/todolists-api";
import {ProgressBar} from "../components/common/ProgressBar/ProgressBar";
import {Snackbar} from "../components/common/Snackbar/Snackbar";
import {AppRootStateType, useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../components/Login/Login";
import {Error404} from "../components/common/Error404/Error404";
import {Spinner} from "../components/common/Spinner/Spinner";
import {TodoListsWrapper} from "../components/Todolist/TodoListsWrapper";
import {Header} from "../components/Header/Header";


export type TasksStateType = {
    [key: string]: TaskType[]
}

export const App = () => {

    const dispatch = useDispatch();

    const status = useAppSelector<RequestStatusType>(state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <Spinner/>
    }

    return (<>
            <Header/>
            <div style={{height: '5px'}}>
                {status === 'loading' && <ProgressBar/>}
            </div>
            <Snackbar/>
            <Routes>
                <Route path="/" element={<TodoListsWrapper/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/404" element={<Error404/>}/>
                <Route path="*" element={<Navigate to={"/404"}/>}/>
            </Routes>
        </>
    );
}

export default App;
