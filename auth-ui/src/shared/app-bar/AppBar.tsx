import React, { useContext } from 'react';
import AppContext from '../context/app-context';
import style from './AppBar.module.scss';

const AppBar: React.FC = () => {
  const appContext = useContext(AppContext);

  const handleToggleDrawer = () => {
    appContext.toggleDrawer();
  };

  return (
    <div className={
        style['app-bar-component'] + ' ' +
        (appContext.isDrawerOpen ? style['menu-open'] : style['menu-closed'])
      }
    >
      <div className={style['btn-icon']} onClick={handleToggleDrawer}>
        <i className='bx bx-menu'></i>
      </div>
    </div>
  )
};

export default AppBar;