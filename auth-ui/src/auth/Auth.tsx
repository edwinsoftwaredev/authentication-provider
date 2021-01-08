import React, { useEffect } from 'react';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom'
import Login from './login/Login';
import style from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';
import Axios from 'axios';
import useWhoAmI from './hooks/useWhoAmI';
import useCsrfToken from '../shared/hooks/useCsrfToken';

const Auth: React.FC = () => {
  const location = useLocation();
  const history = useHistory()
  const whoAmI = useWhoAmI();
  const isCsrfToken = useCsrfToken();

  useEffect(() => {
    if (
        location.pathname !== '/auth/login' &&
        location.pathname !== '/auth/registration' &&
        location.pathname !== '/auth/verify' &&
        whoAmI && 
        isCsrfToken
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

    if (location.pathname === '/auth/verify') {
      history.push('/auth');
    }
  }, [location.pathname, whoAmI, history, isCsrfToken]);

  return (
    <div className={style['auth-component']}>
      {
        location.pathname !== '/auth/login' &&
        location.pathname !== '/auth/registration' &&
        location.pathname !== '/auth/verify' ? (
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