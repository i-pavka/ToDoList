import React, {ChangeEvent, useCallback, useState} from 'react';
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {Checkbox} from "../../common/Checkbox/Checkbox";
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {Button} from "../../common/Button/Button";
import {RequestStatusType} from "../../../app/app-reducer";


export type TaskPropsType = {
  task: TaskType
  removeTask: (taskID: string) => void
  entityStatus: RequestStatusType
  changeTaskStatus: (taskID: string, status: TaskStatuses, title: string) => void
  changeTaskTitle: (taskID: string, newValue: string) => void
}

export const Task: React.FC<TaskPropsType> = React.memo((
  {
    task,
    removeTask,
    changeTaskStatus,
    changeTaskTitle,
    entityStatus,
  }
) => {

  const [hidden, setHidden] = useState(true);

  const onClickHandler = useCallback(() => removeTask(task.id), [removeTask, task.id])
  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked;
    changeTaskStatus(task.id, status ? TaskStatuses.Completed : TaskStatuses.New, task.title);
  }, [changeTaskStatus, task.id])
  const onTitleChangeHandler = useCallback((newValue: string) => {
    changeTaskTitle(task.id, newValue);
  }, [changeTaskTitle, task.id])

  return (
    <div key={task.id} className={"taskItem"}>
      <div className={task.status === TaskStatuses.Completed ? "checkBoxItem is-done" : "checkBoxItem"}>
        {hidden && <Checkbox onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed}/>}
        <EditableSpan value={task.title}
                      onChange={onTitleChangeHandler}
                      hidden={setHidden}
        />
      </div>
      {hidden && <Button onClick={onClickHandler} disabled={entityStatus === 'loading'} red>del</Button>}
    </div>
  );
});

