import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../common/AddItemForm/AddItemForm';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {useDispatch} from "react-redux";
import {Task} from "./Task/Task";
import {SuperButton} from "../common/SuperButton/SuperButton";
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {changeTodolistFilterAC, removeTodoListTC, TodoListDomainType, updateTodoListTitleTC} from "./todolists-reducer";
import {useAppSelector} from "../../app/store";
import {addTaskTC, changeTaskStatusTC, fetchTasksTC, removeTaskTC, updateTaskTitleTC} from "./Task/tasks-reducer";


type PropsType = {
  todoList: TodoListDomainType
}

export const Todolist: React.FC<PropsType> = React.memo(({todoList}) => {

  const dispatch = useDispatch();
  const tasks = useAppSelector<TaskType[]>(state => state.tasks[todoList.id]);

  useEffect(() => {
    dispatch(fetchTasksTC(todoList.id))
  }, [])

  const removeTodolist = useCallback(() => {
    dispatch(removeTodoListTC(todoList.id));
  }, [dispatch])
  const changeTodolistTitle = useCallback((title: string) => {
    dispatch(updateTodoListTitleTC(todoList.id, title));
  }, [dispatch])

  const onAllClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC({id: todoList.id, filter: "all"})), [dispatch, todoList.id]);
  const onActiveClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC({id: todoList.id, filter: "active"})), [dispatch, todoList.id]);
  const onCompletedClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC({id: todoList.id, filter: "completed"})), [dispatch, todoList.id]);

  let tasksForTodoList = tasks;
  if (todoList.filter === "active") {
    tasksForTodoList = tasksForTodoList.filter(el => el.status === TaskStatuses.New);
  }
  if (todoList.filter === "completed") {
    tasksForTodoList = tasksForTodoList.filter(el => el.status === TaskStatuses.Completed);
  }

  const removeTaskHandler = useCallback((taskID: string) => {
    dispatch(removeTaskTC(taskID, todoList.id))
  }, [dispatch])
  const changeTaskStatusHandler = useCallback((taskID: string, status: TaskStatuses, title: string) => {
    // dispatch(_changeTaskStatusTC(todoList.id, taskID, status, title)); // by me
    dispatch(changeTaskStatusTC(todoList.id, taskID, status));
  }, [dispatch])
  const changeTaskTitleHandler = useCallback((taskID: string, newValue: string) => {
    dispatch(updateTaskTitleTC(taskID, newValue, todoList.id));
  }, [dispatch])
  const addTaskHandler = useCallback((title: string) => {
    dispatch(addTaskTC(todoList.id, title))
  }, [dispatch])

  return <div className={"todoListBlock"}>
    <div className={"addItemFormToDoList"}>
      <EditableSpan value={todoList.title} onChange={changeTodolistTitle}/>
      <SuperButton onClick={removeTodolist} disabled={todoList.entityStatus === 'loading'} red>x</SuperButton>
    </div>
    <AddItemForm placeholder={'...add new Task'} addItem={addTaskHandler}
                 disabled={todoList.entityStatus === 'loading'}/>
    <div className={'taskBlock'}>
      {
        tasksForTodoList.map(el => {
          return <Task
            key={el.id}
            task={el}
            entityStatus={todoList.entityStatus}
            removeTask={removeTaskHandler}
            changeTaskStatus={changeTaskStatusHandler}
            changeTaskTitle={changeTaskTitleHandler}/>
        })
      }
    </div>
    <div>
      <SuperButton selected={todoList.filter === 'all'}
                   onClick={onAllClickHandler}>All
      </SuperButton>
      <SuperButton selected={todoList.filter === 'active'}
                   onClick={onActiveClickHandler}>Active
      </SuperButton>
      <SuperButton selected={todoList.filter === 'completed'}
                   onClick={onCompletedClickHandler}>Completed
      </SuperButton>
    </div>
  </div>
})


