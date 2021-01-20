import React, { Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import App from '../../App';
import AppContext from '../context/app-context';
import useWhoAmI, { WhoAmIStatus } from '../hooks/useWhoAmI';
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

  return (
    <Fragment>
      <ul className={style['list']}>
        {
          appContext.isUserActive === WhoAmIStatus.Active ? (
            <div>
              <li className={style['item']} onClick={handleHomeClick}>Home</li>
              <li className={style['item']} onClick={handleSettingsClick}>Account</li>
              <li className={style['item']} onClick={handleLogoutClick}>Logout</li>
            </div>
          ) : null
        }
      </ul>
    </Fragment>
  )
}

export default Menu