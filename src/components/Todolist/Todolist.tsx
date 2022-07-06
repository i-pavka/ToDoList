import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../common/AddItemForm/AddItemForm';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {Task} from "./Task/Task";
import {Button} from "../common/Button/Button";
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {changeTodolistFilterAC, removeTodoListTC, TodoListDomainType, updateTodoListTitleTC} from "./todolists-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {addTaskTC, updateTaskTC, fetchTasksTC, removeTaskTC} from "./Task/tasks-reducer";


type PropsType = {
  todoList: TodoListDomainType
}

export const Todolist: React.FC<PropsType> = React.memo(({todoList}) => {

  const dispatch = useAppDispatch();
  const tasks = useAppSelector<TaskType[]>(state => state.tasks[todoList.id]);

  useEffect(() => {
    dispatch(fetchTasksTC(todoList.id))
  }, [dispatch, todoList.id])

  const removeTodolist = useCallback(() => {
    dispatch(removeTodoListTC(todoList.id));
  }, [dispatch, todoList.id])
  const changeTodolistTitle = useCallback((title: string) => {
    dispatch(updateTodoListTitleTC({todoListID: todoList.id, title}));
  }, [dispatch, todoList.id])

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
    dispatch(removeTaskTC({taskID, todoID: todoList.id}))
  }, [dispatch])
  const changeTaskStatusHandler = useCallback((taskID: string, status: TaskStatuses, title: string) => {
    dispatch(updateTaskTC({todoID: todoList.id, taskID, model: {status}}));
  }, [dispatch])
  const changeTaskTitleHandler = useCallback((taskID: string, newValue: string) => {
    dispatch(updateTaskTC({taskID, model: {title: newValue}, todoID: todoList.id}));
  }, [dispatch])
  const addTaskHandler = useCallback((title: string) => {
    dispatch(addTaskTC({todoID: todoList.id, title}))
  }, [dispatch])

  return (
    <div className={"todoListBlock"}>
      <div className={"addItemFormToDoList"}>
        <EditableSpan value={todoList.title} onChange={changeTodolistTitle}/>
        <Button onClick={removeTodolist} disabled={todoList.entityStatus === 'loading'} red>x</Button>
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
        <Button selected={todoList.filter === 'all'}
                     onClick={onAllClickHandler}>All
        </Button>
        <Button selected={todoList.filter === 'active'}
                     onClick={onActiveClickHandler}>Active
        </Button>
        <Button selected={todoList.filter === 'completed'}
                     onClick={onCompletedClickHandler}>Completed
        </Button>
      </div>
    </div>
  )
})


