import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './auth/auth-service';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Auth from './auth/Auth';

const startAuthentication = (setSigned: React.Dispatch<React.SetStateAction<boolean>>) => {
  const authService = AuthService.getInstance();
  authService.getUser().then(res => {
    if (
      !res && 
      window.location.pathname !== '/auth/codes' &&
      window.location.pathname !== '/auth/logout'
    ) {
      authService.startAuthentication();
    } else {
      setSigned(true);
    }
    // save user
  }, reason => {
    console.log('Error retriving user.');
  });
};

const startSignOut = () => {
  const authService = AuthService.getInstance();
  authService.startSignOut();
}

function App() {
  const [signed, setSigned] = useState(false);
  
  useEffect(() => {
    startAuthentication(setSigned);
  }, []);

  const handleSignOut = () => {
    startSignOut();  
  };

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
              {
                signed ? <button onClick={handleSignOut}>Sign Out</button> : null
              }
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
