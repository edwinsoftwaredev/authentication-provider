import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Login from './login/Login';

const Auth: React.FC = () => {
    return (
        <Switch>
            <Route exact path='/auth/login'>
                <div>
                    <Login />
                </div>
            </Route>
        </Switch>
    );
}

export default Auth;