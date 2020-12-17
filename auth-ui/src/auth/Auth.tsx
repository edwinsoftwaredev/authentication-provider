import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Login from './login/Login';
import AuthStyle from './Auth.module.scss';

const Auth: React.FC = () => {
  return (
    <div className={AuthStyle['auth-component']}>
      <Switch>
        <Route exact path='/auth/login'>
            <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default Auth;