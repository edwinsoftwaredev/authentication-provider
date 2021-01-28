import React, { Fragment, useContext, useEffect, useState } from 'react';
import AppStyle from './App.module.scss';
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom'
import Auth from '../src/auth/Auth';
import useWhoAmI, { WhoAmIStatus, IUser } from './shared/hooks/useWhoAmI';
import AppContext from './shared/context/app-context';
import Menu from './shared/menu/Menu';
import Button from './shared/button/button';
import AppBar from './shared/app-bar/AppBar';
import Clients from './clients/Clients';

const initialState = {
  user: {} as IUser,
  isDrawerOpen: false,
  toggleDrawer: () => {}
};

const ConditionalMenu: React.FC = () => {
  const location = useLocation();
  const appContext = useContext(AppContext);

  return (
    <Fragment>
      {
        location.pathname !== '/auth/login' && 
        location.pathname !== '/auth/registration' &&
        location.pathname !== '/auth/verify' &&
        location.pathname !== '/auth/consent' &&
        location.pathname !== '/auth/recovery' &&
        location.pathname !== '/auth' &&
        appContext.user.active === WhoAmIStatus.Active ? (
          <Menu />
        ) : null
      } 
    </Fragment> 
  );
};

function App() {
  const [globalState, setGlobalState] = useState(initialState);
  const whoAmI = useWhoAmI();

  const toogleDrawer = () => {
    setGlobalState(state => ({...state, isDrawerOpen: !state.isDrawerOpen}));
  }

  useEffect(() => {
    setGlobalState(state => ({...state, toggleDrawer: toogleDrawer}));
  }, [])

  useEffect(() => {
    setGlobalState(state => ({...state, user: whoAmI ?? {} as IUser}));
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
          <AppBar />
          <ConditionalMenu />
          <div className={AppStyle['app-container']}>
            <Switch>
              <Route exact path='/'>
                <div className={AppStyle['app-content']}>
                  <h1 className={AppStyle['app-title']}>
                    Authentication Provider
                  </h1>
                  {
                    whoAmI && whoAmI.active === WhoAmIStatus.NotAuthorized ? (
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
              </Route>
              <Route path='/auth'>
                <Auth />
              </Route>
              <Route exact path='/clients'>
                <Clients />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
