import React from 'react';
import { IUser } from '../hooks/useWhoAmI';

const appContextObject = {
  user: {} as IUser,
  isDrawerOpen: false,
  toggleDrawer: () => {}
};

const AppContext = React.createContext(appContextObject);

export default AppContext;