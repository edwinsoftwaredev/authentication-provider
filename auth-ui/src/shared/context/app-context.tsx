import React from 'react';
import { WhoAmIStatus } from '../hooks/useWhoAmI';

const appContextObject = {
  isUserActive: WhoAmIStatus.NotFetched,
  isDrawerOpen: false,
  toggleDrawer: () => {}
};

const AppContext = React.createContext(appContextObject);

export default AppContext;