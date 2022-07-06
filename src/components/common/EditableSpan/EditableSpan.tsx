import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {InputText} from "../InputText/InputText";

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
  hidden?: (value: boolean) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo((
  {value, onChange, hidden}) => {

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(value);
    hidden && hidden(false)
  }
  const activateViewMode = () => {
    if (title.trim() !== "") {
      setEditMode(false);
      onChange(title);
      hidden && hidden(true)
    } else {
      setError("Title is required");
    }
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null);
    if (e.key === 'Enter') {
      activateViewMode();
    }
  }

  return (
    editMode
      ?
      <InputText
        value={title}
        onChange={changeTitle}
        onKeyPress={onKeyPressHandler}
        onBlur={activateViewMode}
        error={error}
        autoFocus/>
      : <span onDoubleClick={activateEditMode}>{value}</span>
  )
})
