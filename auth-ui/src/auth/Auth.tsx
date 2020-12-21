import React, { useEffect } from 'react';
import {Route, Switch, useLocation} from 'react-router-dom'
import Login from './login/Login';
import AuthStyle from './Auth.module.scss';
import Registration from './registration/Registration';
import Verification from './verification/Verification';

const Auth: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth') {
      window.location.href = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/'; 
    }
  }, [location.pathname]);

  return (
    <div className={AuthStyle['auth-component']}>
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