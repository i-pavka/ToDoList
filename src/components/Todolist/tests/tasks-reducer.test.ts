import {addTodoListTC, fetchTodosTC, removeTodoListTC} from "../todolists-reducer";
import {v1} from "uuid";
import {TasksStateType} from "../../../app/App";
import {TaskPriorities, TaskStatuses} from "../../../api/todolists-api";
import {
  addTaskTC, updateTaskTC,
  fetchTasksTC, removeTaskTC,
  tasksReducer,
} from "../Task/tasks-reducer";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    "todoListId-1": [
      {
        id: "1", title: "CSS", status: TaskStatuses.New,
        todoListId: 'todoListId-1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "2", title: "JS", status: TaskStatuses.Completed,
        todoListId: 'todoListId-1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "3", title: "React", status: TaskStatuses.New,
        todoListId: 'todoListId-1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
    ],
    "todoListId-2": [
      {
        id: "1", title: "bread", status: TaskStatuses.New,
        todoListId: 'todoListId-2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "2", title: "milk", status: TaskStatuses.Completed,
        todoListId: 'todoListId-2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "3", title: "tea", status: TaskStatuses.New,
        todoListId: 'todoListId-2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
    ]
  };
});

test('empty arrays should be added when we set todoLists', () => {
  const action = fetchTodosTC.fulfilled({
    todos:
      [
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''},
      ]
  }, 'requestId')

  const endState = tasksReducer({}, action);
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);

  expect(endState['1']).toStrictEqual([]);
  expect(endState['2']).toStrictEqual([]);
});
test('tasks should be added for todoLists', () => {
  const action = fetchTasksTC.fulfilled(
    {todoID: 'todoListId-1', tasks: startState['todoListId-1']}, 'requestId', 'todoListId-1')

  const endState = tasksReducer({
    "todoListId-1": [],
    "todoListId-2": [],
  }, action);

  expect(endState['todoListId-1'].length).toBe(3);
  expect(endState['todoListId-2'].length).not.toBe(1);

});
test('correct task should be deleted from correct array', () => {
  const action = removeTaskTC.fulfilled(
    {taskID: "2", todoListID: "todoListId-2"},
    'requestId',
    {taskID: '2', todoID: "todoListId-2"}
  );

  const endState = tasksReducer(startState, action)

  expect(endState["todoListId-1"].length).toBe(3);
  expect(endState["todoListId-2"].length).toBe(2);
  expect(endState["todoListId-2"].every(el => el.id !== "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
  const action = addTaskTC.fulfilled(
    {
      item: startState['todoListId-2'][1]
    },
    'requestId',
    {
      todoID: startState['todoListId-2'][1].id,
      title: startState['todoListId-2'][1].title
    });

  const endState = tasksReducer(startState, action)

  expect(endState["todoListId-1"].length).toBe(3);
  expect(endState["todoListId-2"].length).toBe(4);

  expect(endState["todoListId-2"][0].id).toBeDefined();
  expect(endState["todoListId-2"][0].title).toBe("milk");
  expect(endState["todoListId-2"][0].status).toBe(TaskStatuses.Completed);
});
test('status of specified task should be changed', () => {
  const testData = {
    todoID: "todoListId-2",
    taskID: "2",
    model: {status: TaskStatuses.New}
  }
  const action = updateTaskTC.fulfilled(testData, "requestId", testData);

  const endState = tasksReducer(startState, action)

  expect(endState["todoListId-1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todoListId-2"][1].status).toBe(TaskStatuses.New);
});
test('title of specified task should be changed', () => {
  const testData = {
    todoID: "todoListId-2",
    taskID: "2",
    model: {title: "yogurt"}
  }
  const action = updateTaskTC.fulfilled(testData, 'requestId', testData);
  const endState = tasksReducer(startState, action)

  expect(endState["todoListId-1"][1].title).toBe("JS");
  expect(endState["todoListId-2"][1].title).toBe("yogurt");
  expect(endState["todoListId-2"][0].title).toBe("bread");
});
test('new array should be added when new todolist is added', () => {
  const action = addTodoListTC.fulfilled({
    item: {
      id: v1(), title: "What to learn", addedDate: '',
      order: 0,
    }
  }, 'requestId', 'What to learn');

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== "todoListId-1" && k !== "todoListId-2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test('property with todolistId should be deleted', () => {
  const action = removeTodoListTC.fulfilled({todoListID: "todoListId-2"},
    'requestId',
    "todoListId-2"
  );

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todoListId-2"]).not.toBeDefined();
});
