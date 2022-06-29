import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {SuperInputText} from "../SuperInput/SuperInputText";
import {SuperButton} from "../SuperButton/SuperButton";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    placeholder?: string
    disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo((
    {addItem, placeholder, disabled}) => {

    const [title, setTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.key === 'Enter') {
            addItemHandler();
        }
    }
    const mouseOverHandler = () => {

    }
    return <div className={"addItemForm"}>
        <SuperInputText value={title}
                        placeholder={placeholder}
                        onChange={onChangeHandler}
                        onKeyPress={onKeyPressHandler}
                        error={error}
                        disabled={disabled}
        >

        </SuperInputText>
        {/* ToDo: Возможно ли убрать перерисовку кнопки в момент набора текста в инпуте? */}
        <SuperButton onMouseOver={mouseOverHandler}
                     disabled={disabled}
                     onClick={addItemHandler}>add</SuperButton>
    </div>
})
