import React, { useContext, useEffect, useState } from 'react';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom'
import Login from './login/Login';
import style from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';
import Axios from 'axios';
import useCsrfToken from '../shared/hooks/useCsrfToken';
import Consent from './consent/Consent';
import AppContext from '../shared/context/app-context';
import { WhoAmIStatus } from '../shared/hooks/useWhoAmI';

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

const processLogoutChallenge = (logoutChallege: string) => {
  Axios.post(
    `${process.env.REACT_APP_AUTH_SERVER_LOGOUT_CHALLENGE}`,
    {
      logoutChallenge: logoutChallege
    },
    {withCredentials: true}
  ).then(res => {
    window.location.href = res.data.redirectUrl;
  });
};

const Auth: React.FC = () => {
  const [loginChallenge, setLoginChallenge] = useState<string| null>();
  const [consentChallenge, setConsentChallenge] = useState<string | null>();
  const [logoutChallenge, setLogoutChallege] = useState<string | null>();
  const location = useLocation();
  const isCsrfToken = useCsrfToken();
  const history = useHistory();
  const context = useContext(AppContext);

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    setLoginChallenge(urlSearch.get('login_challenge'));
    setConsentChallenge(urlSearch.get('consent_challenge'));
    setLogoutChallege(urlSearch.get('logout_challenge'));
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (
      location.pathname === '/auth' &&
      isCsrfToken &&
      !(loginChallenge || consentChallenge || logoutChallenge) &&
      context.isUserActive === WhoAmIStatus.Active
    ) {
      history.push('/');
    }

    if (
      location.pathname === '/auth' &&
      isCsrfToken &&
      (loginChallenge || consentChallenge || logoutChallenge)
    ) {
      if (loginChallenge && context.isUserActive === WhoAmIStatus.Active) {
        processLoginChallenge(loginChallenge);
      }

      if (loginChallenge && context.isUserActive === WhoAmIStatus.NotAuthorized) {
        redirectToLogin();
      }

      if (consentChallenge && context.isUserActive === WhoAmIStatus.Active) {
        Axios.get(
          `${process.env.REACT_APP_AUTH_SERVER_CONSENT_CHALLENGE}`,
          {
            withCredentials: true,
            params: {
              consent_challenge: consentChallenge
            }
          }
        ).then(res => {
          if (res.data.redirectUrl) {
            window.location.href = res.data.redirectUrl;  
          } else {
            history.push('/auth/consent', res.data);
          }
        });
      }

      if (logoutChallenge) {
        processLogoutChallenge(logoutChallenge);
      }
    }
  }, [
    loginChallenge,
    consentChallenge,
    logoutChallenge,
    isCsrfToken,
    location.pathname,
    history,
    context
  ]);

  return (
    <div className={style['auth-component']}>
      <Switch>
        <Route exact path='/auth'>
          {
            (loginChallenge || consentChallenge || logoutChallenge) ? (
              <div className={style['auth-message']}>
                Validating Session...
              </div>
            ) : null
          }
          {
            location.pathname === '/auth' && 
            !(
              loginChallenge || 
              consentChallenge || 
              logoutChallenge || 
              context.isUserActive === WhoAmIStatus.Active
            ) ? (
              <div className={style['auth-message']}>
                A challenge is required to continue. 
              </div>
            ) : null
          }
        </Route>
        <Route exact path='/auth/login'>
          <Login />
        </Route>
        <Route exact path='/auth/registration'>
          <Registration />
        </Route>
        <Route exact path='/auth/verify'>
          <Verification />
        </Route>
        <Route exact path='/auth/consent'>
          <Consent />
        </Route>
      </Switch>
    </div>
  );
};

export default Auth;