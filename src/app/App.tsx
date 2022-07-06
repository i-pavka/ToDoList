import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {TaskType} from "../api/todolists-api";
import {ProgressBar} from "../components/common/ProgressBar/ProgressBar";
import {Snackbar} from "../components/common/Snackbar/Snackbar";
import {useAppSelector} from "./store";
import {initializeAppTC} from "./app-reducer";
import {Route, Routes} from "react-router-dom";
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

  const {isInitialized, status} = useAppSelector(state => state.app);

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [dispatch])

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
        <Route path="*" element={<Error404/>}/>
      </Routes>
    </>
  );
}

export default App;
