import React from 'react';
import {Link} from "react-router-dom";
import s from './Error404.module.css';

export const Error404 = () => (
  <div className={s.errorMain}>
    <h2>404</h2>
    <h1>—ฅ/ᐠ.̫ .ᐟ\ฅ—</h1>
    <h2>Nya, page not found!</h2>
    <div>
      <Link to={'/login'} className={s.link}>LogIn</Link>
    </div>
  </div>
);

