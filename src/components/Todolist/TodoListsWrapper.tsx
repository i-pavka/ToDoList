import React, {useCallback, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../app/store";
import {addTodoListTC, fetchTodosTC} from "./todolists-reducer";
import {Todolist} from "./Todolist";
import {useNavigate} from "react-router-dom";
import '../../app/App.css';
import {AddItemForm} from "../common/AddItemForm/AddItemForm";

export const TodoListsWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {todoLists} = useAppSelector(state => state);
  const {isLoggedIn} = useAppSelector(state => state.login);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTodosTC())
    } else {
      navigate('login')
    }
  }, [isLoggedIn])

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodoListTC(title))
  }, [dispatch])

  return (
    <main className="mainBlock">
      <div className="addInput">
        <AddItemForm placeholder={'...add new ToDo List'} addItem={addTodolist}/>
      </div>
      <div className="todoListMainBlock">
        {
          todoLists.map(el => {
            return (<Todolist
                key={el.id}
                todoList={el}/>
            )
          })
        }
      </div>
    </main>
  );
};

