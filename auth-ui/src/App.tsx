import React from 'react';
import logo from './logo.svg';
import AppStyle from './App.module.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Auth from '../src/auth/Auth';

function App() {
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
              <a
                href="http://127.0.0.1:4433/self-service/login/browser"
              >
                Sign In
              </a>
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
