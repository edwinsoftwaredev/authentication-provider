import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import AppStyle from './App.module.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Auth from '../src/auth/Auth';
import useWhoAmI, { WhoAmIStatus } from './shared/hooks/useWhoAmI';
import AppContext from './shared/context/app-context';

const initialState = {
  isUserActive: WhoAmIStatus.NotFetched,
};

function App() {
  const [globalState, setGlobalState] = useState(initialState);
  const whoAmI = useWhoAmI();

  useEffect(() => {
    setGlobalState(state => ({...state, isUserActive: whoAmI}));
  }, [whoAmI]);

  return (
    <AppContext.Provider value={globalState}>
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
                {
                  whoAmI === WhoAmIStatus.NotAuthorized ? (
                    <div>
                      <a href={process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/'}>Sign In</a>
                      <br />
                      <a href={process.env.REACT_APP_KRATOS_SELF_SERVICE_REGISTRATION ?? '/'}>Sign Up</a>
                    </div>
                  ) : (
                    <div>
                      <a href='/#'>Sign Out</a>
                    </div>
                  )
                }
              </header>
            </Route>
            <Route path='/auth'>
              <Auth />
            </Route>
          </Switch>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
