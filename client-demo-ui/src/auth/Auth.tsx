import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthCodes from './auth-codes/AuthCodes';

const Auth: React.FC = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/auth/codes'>
          <AuthCodes />
        </Route>
      </Switch>
    </div>
  );
};

export default Auth;