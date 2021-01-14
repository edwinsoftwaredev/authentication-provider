import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './auth/auth-service';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Auth from './auth/Auth';

const startAuthentication = () => {
  const authService = AuthService.getInstance();
  authService.getUser().then(res => {
    if (!res && window.location.pathname !== '/auth/codes') {
      authService.startAuthentication();
    }

    // save user
  }, reason => {
    console.log('Error retriving user.');
  });
};

function App() {
  
  useEffect(() => {
    startAuthentication();
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
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
