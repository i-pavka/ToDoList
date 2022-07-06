import {v1} from 'uuid';
import {
  addTodoListTC,
  changeTodolistFilterAC, fetchTodosTC, FilterValuesType, removeTodoListTC,
  TodoListDomainType,
  todoListsReducer, updateTodoListTitleTC
} from "../todolists-reducer";

let todoListId1: string;
let todoListId2: string;
let startState: TodoListDomainType[] = []

beforeEach(() => {
  todoListId1 = v1();
  todoListId2 = v1();
  startState = [
    {
      id: todoListId1, title: "What to learn", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    },
    {
      id: todoListId2, title: "What to buy", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    }
  ]

})

test('todolist should be set to the state', () => {
  const payload = {todos: startState};
  const action = fetchTodosTC.fulfilled(payload, 'requestId');

  const endState = todoListsReducer([], action);

  expect(endState.length).toBe(2);
  expect(endState[1].title).toBe('What to buy');
});
test('correct todolist should be removed', () => {
  let todoListId1 = v1();
  let todoListId2 = v1();

  const startState: TodoListDomainType[] = [
    {
      id: todoListId1, title: "What to learn", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    },
    {
      id: todoListId2, title: "What to buy", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    }
  ]

  const endState = todoListsReducer(startState, removeTodoListTC.fulfilled(
    {todoListID: todoListId1},
    'requestId',
    todoListId1
  ))

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoListId2);
});
test('correct todolist should be added', () => {
  let todolistId1 = v1();
  let todolistId2 = v1();
  let todolistId3 = v1();

  let newTodoListTitle = "New Todolist";

  const startState: TodoListDomainType[] = [
    {
      id: todolistId1, title: "What to learn", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    },
    {
      id: todolistId2, title: "What to buy", filter: "all", addedDate: '',
      order: 0, entityStatus: 'idle'
    }
  ]

  const endState = todoListsReducer(startState, addTodoListTC.fulfilled(
    {item: {id: todolistId3, title: newTodoListTitle, addedDate: '', order: 0,}},
    'requestId', newTodoListTitle
  ))

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodoListTitle);
});
test('correct todolist should change its name', () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  let newTodolistTitle = "New Todolist";

  const startState: TodoListDomainType[] = [
    {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
    {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
  ]

  const endState = todoListsReducer(
    startState, updateTodoListTitleTC.fulfilled(
      {id: todolistId2, title: newTodolistTitle},
      'requestId',
      {todoListID: todolistId2, title: newTodolistTitle}
      )
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});
test('correct filter of todolist should be changed', () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  let newFilter: FilterValuesType = "completed";

  const startState: TodoListDomainType[] = [
    {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
    {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
  ]

  const endState = todoListsReducer(startState, changeTodolistFilterAC(
    {id: todolistId2, filter: newFilter}));

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

