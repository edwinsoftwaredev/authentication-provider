import React, { useEffect } from 'react';
import {Route, Switch, useLocation} from 'react-router-dom'
import Login from './login/Login';
import style from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';
import Axios from 'axios';
import useWhoAmI from './hooks/useWhoAmI';

const Auth: React.FC = () => {
  const location = useLocation();
  const whoAmI = useWhoAmI();

  useEffect(() => {
    if (
        location.pathname !== '/auth/login' &&
        location.pathname !== '/auth/registration' &&
        whoAmI
    ) {
      if (whoAmI.data.active) {
        /**
         * here withCredential is set to true to tell the browser to send
         * the session cookie required by flask in order to find the session
         * which stores the csrf token. remember that csrf tokens have a life 
         * of a session.
        */
        Axios.post(
          `${process.env.REACT_APP_AUTH_SERVER_LOGIN_CHALLENGE}`, 
          {},
          {withCredentials: true}
        )
        .then(res => console.log(res));
      }
    }
  }, [location.pathname, whoAmI]);

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
};

export default Auth;