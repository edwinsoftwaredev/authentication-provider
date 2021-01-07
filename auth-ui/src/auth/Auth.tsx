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
            /* 
              If you use localhost, use localhost in all places.
              If you use 127.0.0.1, 127.0.0.1 in all places.
              If there is a mix cookie will not work properly.

              withCredentials has to be set to true in order
              to set the cookies and send the cookies to the server*/
            
            Axios.get(`${process.env.REACT_APP_AUTH_SERVER_CSRF}`, {withCredentials: true})
              .then(res => {

                const csrfToken = document
                  .cookie
                  .split('; ')
                  .find(cookie => cookie.startsWith('auth-csrf-token'))
                  ?.split('=')[1];

                /**
                 * here withCredential is set to true to tell the browser to send
                 * the session cookie required by flask in order to find the session
                 * which stores the csrf token. remember that csrf tokens have a life 
                 * of a session.
                */
                Axios.post(`${process.env.REACT_APP_AUTH_SERVER_LOGIN_CHALLENGE}`, {}, {
                  withCredentials: true,
                  headers: {'X-CSRFToken': csrfToken}
                })
                  .then(res => console.log(res));
              });
          }
        }, (reason: any) => {
          window.location.href = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/';
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