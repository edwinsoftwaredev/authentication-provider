import React, { useEffect } from 'react';
import {Route, Switch, useLocation} from 'react-router-dom'
import Login from './login/Login';
import style from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';
import Axios, { AxiosResponse } from 'axios';

const Auth: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/auth/login' && location.pathname !== '/auth/registration') {
      Axios.get(`${process.env.REACT_APP_KRATOS_SERVER}sessions/whoami`, {withCredentials: true})
        .then((response: AxiosResponse<any>) => {
          // if the session is valid then the hydra flow should continue
          // With the response it is posible to validate if the user
          // has validated addresses.

          if (response.data.active) {
            console.info('User is valid. Hydra next steps should follow.');
          }
        }, (reason: any) => {
          // window.location.href = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/';
        });
    }
  }, [location.pathname]);

  return (
    <div className={style['auth-component']}>
      {
        location.pathname !== '/auth/login' && location.pathname !== '/auth/registration' ? (
          <div className={style['auth-message']}>
            Validating Session...
          </div>
        ) : null
      }
      <Switch>
        <Route exact path='/auth/login'>
          <Login />
        </Route>
        <Route exact path='/auth/registration'>
          <Registration />
        </Route>
        <Route exact path='/auth/verify'>
          <Verification />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;