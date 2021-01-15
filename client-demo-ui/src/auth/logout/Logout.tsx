import React, { useEffect } from 'react';
import AuthService from '../auth-service';
import style from './Logout.module.scss';

const Logout: React.FC = () => {
  useEffect(() => {
    const authService = AuthService.getInstance();
    authService.completeSignOut();
  }, []);

  return (
    <div>
      Logged Out.
    </div>
  );
}

export default Logout;