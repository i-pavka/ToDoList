import React from 'react';
import s from "./Login.module.css";
import {useFormik} from 'formik';
import SuperCheckbox from "../common/SuperCheckbox/SuperCheckbox";
import {useDispatch, useSelector} from "react-redux";
import {authLogInTC} from "./login-reducer";
import {AppRootStateType} from "../../app/store";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      const errors = {} as FormikErrorType;
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.password) {
        errors.password = 'password is required';
        // } else if (!/^(?=.*\d)(?=.*[a-z]).{8,}$/i.test(values.password)) {
      } else if (values.password.length < 3) {
        // errors.password = 'must contain 8 characters and one digit or letter';
        errors.password = 'must contain 3 characters';
      }
      return errors;
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: values => {
      dispatch(authLogInTC(values))
      formik.resetForm();
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"}/>
  }

  return (
    <div className={s.mainBlock}>
      <h1>Login Form</h1>
      <form className={s.loginForm} onSubmit={formik.handleSubmit}>
        <div className={s.blockInfoError}>
          <input
            className={s.superInput}
            placeholder="Email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email &&
            <div className={s.errorMessage}>{formik.errors.email}</div>}
        </div>
        <div className={s.blockInfoError}>
          <input
            className={s.superInput}
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password &&
            <div className={s.errorMessage}>{formik.errors.password}</div>}
        </div>

        <SuperCheckbox  {...formik.getFieldProps("rememberMe")}
                        checked={formik.values.rememberMe}>
          remember me
        </SuperCheckbox>

        <button className={s.superButton} type="submit">LOGIN</button>
      </form>
    </div>

  );
};

