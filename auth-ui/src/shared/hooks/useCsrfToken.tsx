import { useEffect, useState } from "react"
import Axios, { AxiosRequestConfig } from 'axios';

const useCsrfToken = (props?: any) => {
  const [isCsrfToken, setIsCsrfToken] = useState<boolean>(false);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_AUTH_SERVER_CSRF}`, {withCredentials: true})
      .then(res => {
        const cookieName = 'auth-csrf-token';

        const csrfToken = document
          .cookie
          .split('; ')
          .find(cookie => cookie.startsWith(cookieName))
          ?.split('=')[1];
  
        if (csrfToken) {
          Axios.interceptors.request.use((request: AxiosRequestConfig) => {
            request.headers['X-CSRFToken'] = csrfToken;
            return request;
          });
          
          setIsCsrfToken(true);
        } else {
          setIsCsrfToken(false);
        }
      });
  }, []);

  return isCsrfToken;
};

export default useCsrfToken;