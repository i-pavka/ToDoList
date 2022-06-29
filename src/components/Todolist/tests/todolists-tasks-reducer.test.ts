import {addTodolistAC, TodoListDomainType, todoListsReducer} from "../todolists-reducer";
import {v1} from "uuid";
import {TasksStateType} from "../../../app/App";
import {tasksReducer} from "../Task/tasks-reducer";


test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodoListsState: TodoListDomainType[] = [];

  const action = addTodolistAC({
    item: {id: v1(), title: "What to learn", addedDate: '', order: 0}
  });

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodoListsState = todoListsReducer(startTodoListsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.item.id);
  expect(idFromTodoLists).toBe(action.payload.item.id);
});
