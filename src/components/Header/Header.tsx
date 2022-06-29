import React from 'react';
import s from './Header.module.css'
import {SuperButton} from "../common/SuperButton/SuperButton";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {logoutTC} from "../Login/login-reducer";

export const Header = () => {
    const dispatch = useDispatch();

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn);

    const logoutHandler = () => {
        dispatch(logoutTC())
    };

    return (<header className={s.mainBlock}>
            <div className={s.header}>
                <h3>ToDo List</h3>
                {isLoggedIn && <SuperButton onClick={logoutHandler} className={s.logoutButton}>
                    LogOut
                </SuperButton>}
            </div>
        </header>
    );
};

