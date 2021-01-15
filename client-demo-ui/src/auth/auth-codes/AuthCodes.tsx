import React, { useEffect } from 'react';
import AuthService from '../auth-service';

const AuthCodes: React.FC = () => {
  useEffect(() => {
    const authService = AuthService.getInstance();

    authService.completeAuthentication().then(res => {
      // console.log(res);
      // console.log('Authentication Complete');
    });
  }, []);

  return (
    <div>AuthCodes Works!</div>
  )
};

export default AuthCodes;