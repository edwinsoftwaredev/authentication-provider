import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import { useLocation } from 'react-router-dom';

interface IWhoAmI {

}

const useWhoAmI = (props?: IWhoAmI) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const location = useLocation();
    
  useEffect(() => {
    if (
      location.pathname !== '/auth/login' &&
      location.pathname !== '/auth/registration' &&
      location.pathname !== '/auth/verify'
    ) {
      Axios.get(
        `${process.env.REACT_APP_KRATOS_SERVER}sessions/whoami`,
        {withCredentials: true}
      ).then((res: AxiosResponse) => {
        setResponse(res);
      }, (reason: any) => {
        window.location.href = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/';
      });      
    }
  }, [location.pathname]);

  return response;
}

export default useWhoAmI;