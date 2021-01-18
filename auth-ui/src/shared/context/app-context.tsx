import React from 'react';
import { WhoAmIStatus } from '../hooks/useWhoAmI';

const appContextObject = {
  isUserActive: WhoAmIStatus.NotFetched
};

const AppContext = React.createContext(appContextObject);

export default AppContext;