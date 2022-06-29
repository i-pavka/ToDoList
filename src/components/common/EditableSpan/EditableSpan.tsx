import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {SuperInputText} from "../SuperInput/SuperInputText";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    hidden?: (value: boolean) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo((
    {value, onChange, hidden}) => {
// ToDo: как то обозначить что его можно изменить по клику, например рисунок рисунок карандашика
    // console.log('EditableSpan');

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
            <SuperInputText
                value={title}
                onChange={changeTitle}
                onKeyPress={onKeyPressHandler}
                onBlur={activateViewMode}
                error={error}
                autoFocus/>
            : <span onDoubleClick={activateEditMode}>{value}</span>
    )
})
