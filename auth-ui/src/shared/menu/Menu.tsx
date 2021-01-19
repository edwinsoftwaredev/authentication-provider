import React, { Fragment } from 'react';
import style from './Menu.module.scss';

const Menu: React.FC = () => {
  
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
  }

  return (
    <Fragment>
      <ul className={style['list']}>
        <li className={style['item']} onClick={handleSettingsClick}>Account</li>
        <li className={style['item']} onClick={handleLogoutClick}>Logout</li>
      </ul>
    </Fragment>
  )
}

export default Menu