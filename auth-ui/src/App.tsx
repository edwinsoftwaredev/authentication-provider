import React, { useEffect } from 'react';
import logo from './logo.svg';
import AppStyle from './App.module.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Auth from '../src/auth/Auth';

function App() {
  useEffect(() => {
    const path = window.location.pathname;
    if (
        path !== '/auth' &&
        path !== '/auth/login' &&
        path !== '/auth/consent' &&
        path !== '/auth/registration' &&
        path !== '/auth/codes' &&
        path !== '/auth/verify'
    ) {    
      window.location.href = '/auth';
    }
  }, []);

  return (
    <div className={AppStyle['App']}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <header className={AppStyle['App-header']}>
              <img src={logo} className={AppStyle['App-logo']} alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className={AppStyle['App-link']}
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <a href={process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/'}>Sign In</a>
              <a href={process.env.REACT_APP_KRATOS_SELF_SERVICE_REGISTRATION ?? '/'}>Sign Up</a>
            </header>
          </Route>
          <Route path='/auth'>
            <Auth />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
