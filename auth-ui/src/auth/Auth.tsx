import React, { useEffect, useState } from 'react';
import {Route, Switch, useLocation} from 'react-router-dom'
import Login from './login/Login';
import style from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';
import Axios from 'axios';
import useCsrfToken from '../shared/hooks/useCsrfToken';

const redirectToLogin = () => {
  window.location.href = `${process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN}` +
  `?return_to=${window.location.href}` ?? '/';
};

const processLoginChallenge = (loginChallenge: string) => {
  Axios.post(
    `${process.env.REACT_APP_AUTH_SERVER_LOGIN_CHALLENGE}`, 
    {
      loginChallenge: loginChallenge
    },
    {withCredentials: true}
  )
  .then(res => window.location.href = res.data.redirectUrl);
};

const processConsentChallenge = (consentChallege: string) => {

};

const Auth: React.FC = () => {
  const [loginChallenge, setLoginChallenge] = useState<string| null>();
  const [consentChallenge, setConsentChallenge] = useState<string | null>();
  const location = useLocation();
  const isCsrfToken = useCsrfToken();

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    setLoginChallenge(urlSearch.get('login_challenge'));
    setConsentChallenge(urlSearch.get('consent_challenge'));
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname === '/auth' &&
        isCsrfToken &&
        (loginChallenge || consentChallenge)) {
      Axios.get(
        `${process.env.REACT_APP_AUTH_SERVER_WHOAMI}`,
        {withCredentials: true}
      ).then(res => {
        if (res.data.active) {
          if (loginChallenge) {
            processLoginChallenge(loginChallenge);
          }

          if (consentChallenge) {
            processConsentChallenge(consentChallenge);
          }
        } else {
          console.log('User is not active');
        }
      }, reason => {
        redirectToLogin();
      });
    }
  }, [loginChallenge, consentChallenge, isCsrfToken, location.pathname]);

  return (
    <div className={style['auth-component']}>
      {
        location.pathname !== '/auth/login' &&
        location.pathname !== '/auth/registration' &&
        location.pathname !== '/auth/verify' &&
        (loginChallenge || consentChallenge) ? (
          <div className={style['auth-message']}>
            Validating Session...
          </div>
        ) : null
      }
      {
        location.pathname === '/auth' && 
        !(loginChallenge || consentChallenge) ? (
          <div className={style['auth-message']}>
            A challenge is required to continue. 
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