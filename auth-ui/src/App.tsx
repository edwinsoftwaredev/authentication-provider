import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import AppStyle from './App.module.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Auth from '../src/auth/Auth';
import useWhoAmI, { WhoAmIStatus } from './shared/hooks/useWhoAmI';
import AppContext from './shared/context/app-context';
import Menu from './shared/menu/Menu';
import Button from './shared/button/button';

const initialState = {
  isUserActive: WhoAmIStatus.NotFetched,
};

function App() {
  const [globalState, setGlobalState] = useState(initialState);
  const whoAmI = useWhoAmI();

  useEffect(() => {
    setGlobalState(state => ({...state, isUserActive: whoAmI}));
  }, [whoAmI]);

  const handleLogin = () => {
    const redir = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN;
    window.location.href = redir ? redir : '';
  }

  const handleRegistration = () => {
    const redir = process.env.REACT_APP_KRATOS_SELF_SERVICE_REGISTRATION;
    window.location.href = redir ? redir : '';
  };

  return (
    <AppContext.Provider value={globalState}>
      <div className={AppStyle['App']}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <div className={AppStyle['app-container']}>
                {
                  whoAmI === WhoAmIStatus.Active ? (
                    <div className={AppStyle['menu']}>
                    <Menu />
                  </div>
                  ) : null
                }
                <div className={AppStyle['app-content']}>
                  <h1 className={AppStyle['app-title']}>
                    Authentication Provider
                  </h1>
                  {
                    whoAmI === WhoAmIStatus.NotAuthorized ? (
                      <div className={AppStyle['auth-buttons']}>
                        <Button 
                          type='button' 
                          text='Sign In'
                          classType='default'
                          onClick={handleLogin}
                        />
                        <Button
                          type='button'
                          text='Sign Up'
                          classType='default'
                          onClick={handleRegistration} 
                        />
                      </div>
                    ) : null
                  }
                </div>
              </div>
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
