import React from 'react';
import s from './Snackbar.module.css'
import {useAppSelector} from "../../../app/store";
import {useDispatch} from "react-redux";
import {setAppErrorAC} from "../../../app/app-reducer";


export const Snackbar = () => {
    const dispatch = useDispatch();
    const  error = useAppSelector<string | null>(state => state.app.error);


    const closingHandler = () => {
        dispatch(setAppErrorAC({error: null}))
    }

    return (<>
            {error && <div className={s.snackbar}>
                {error}
                <div onClick={closingHandler} className={s.close}></div>
            </div>}
        </>
    );
};

