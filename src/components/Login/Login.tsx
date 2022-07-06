import React from 'react';
import s from "./Login.module.css";
import {FormikHelpers, useFormik} from 'formik';
import {Checkbox} from "../common/SuperCheckbox/Checkbox";
import {authLogInTC} from "./login-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(state => state.login.isLoggedIn);

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
    onSubmit: async (values, formikHelpers: FormikHelpers<FormikErrorType>) => {
      const action = await dispatch(authLogInTC(values));
      if (authLogInTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      }
      // formik.resetForm();
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"}/>
  }

  return (
    <div className={s.mainBlock}>
      <div className={s.infoBlock}>
        <h1>Mongo Network</h1>
        <div>To log in get registered here
          Or use common test account credentials:
        </div>
        <div className={s.loginData}>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </div>
      </div>
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

        <Checkbox  {...formik.getFieldProps("rememberMe")}
                   checked={formik.values.rememberMe}>
          remember me
        </Checkbox>

        <button className={s.superButton} type="submit">LOGIN</button>
      </form>
    </div>

  );
};

