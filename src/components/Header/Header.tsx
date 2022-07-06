import React from 'react';
import s from './Header.module.css'
import {Button} from "../common/Button/Button";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../app/store";
import {logoutTC} from "../Login/login-reducer";

export const Header = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useAppSelector(state => state.login.isLoggedIn);

  const logoutHandler = () => {
    dispatch(logoutTC())
  };

  return (<header className={s.mainBlock}>
      <div className={s.header}>
        <h3>ToDo List</h3>
        {isLoggedIn && <Button onClick={logoutHandler} className={s.logoutButton}>
          LogOut
        </Button>}
      </div>
    </header>
  );
};

