import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthCodes from './auth-codes/AuthCodes';
import Logout from './logout/Logout';

const Auth: React.FC = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/auth/codes'>
          <AuthCodes />
        </Route>
        <Route exact path='/auth/logout'>
          <Logout />
        </Route>
      </Switch>
    </div>
  );
};

export default Auth;