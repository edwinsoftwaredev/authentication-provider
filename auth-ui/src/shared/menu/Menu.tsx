import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../context/app-context';
import { WhoAmIStatus } from '../hooks/useWhoAmI';
import style from './Menu.module.scss';

const Menu: React.FC = () => {
  
  const history = useHistory();
  const appContext = useContext(AppContext);

  const handleSettingsClick = () => {
    // remember to add return_to query param
    const redir = process.env.REACT_APP_KRATOS_SELF_SERVICE_SETTINGS;
    window.location.href = redir ? redir : '';
  }
  // the logout endpoint is not protected with a csrf token
  // https://www.ory.sh/kratos/docs/self-service/flows/user-logout#self-service-user-logout-for-browser-applications
  const handleLogoutClick = () => {
    const redir = process.env.REACT_APP_KRATOS_LOGOUT;
    window.location.href =  redir ? redir + `?return_to=${window.location.href}` : '';
  };

  const handleHomeClick = () => {
    history.push('/');
  };

  const handleOverlayClick = () => {
    if (appContext.isDrawerOpen) {
      appContext.toggleDrawer();
    }
  };

  return (
    <div className=
      {
        style['menu-component'] + ' ' + 
        (appContext.isDrawerOpen ? style['open'] : style['closed'])
      }
      onClick={handleOverlayClick}
    >
      <ul className=
        {
          style['list'] + ' ' +
          (appContext.isDrawerOpen ? style['open'] : style['closed'])
        }
        onClick={e => e.stopPropagation()}
      >
        {
          appContext.isUserActive === WhoAmIStatus.Active || true ? (
            <div>
              <li className={style['item']} onClick={handleHomeClick}>
                <div className={style['item-icon']}>
                  <i className='bx bx-home-alt'></i>
                  Home
                </div>
              </li>
              <li className={style['item']} onClick={handleSettingsClick}>
                <div className={style['item-icon']}>
                  <i className='bx bxs-user-account'></i>
                  Account
                </div>
              </li>
              <li className={style['item']} onClick={handleLogoutClick}>
                <div className={style['item-icon']}>
                  <i className='bx bx-log-out-circle' ></i>
                  Sign Out
                </div>
              </li>
            </div>
          ) : null
        }
      </ul>
    </div>
  )
}

export default Menu