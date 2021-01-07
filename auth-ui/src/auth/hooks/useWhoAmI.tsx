import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';

interface IWhoAmI {

}

const useWhoAmI = (props?: IWhoAmI) => {
  const [response, setResponse] = useState<AxiosResponse>();

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_KRATOS_SERVER}sessions/whoami`,
      {withCredentials: true}
    ).then((res: AxiosResponse) => {
      setResponse(res);
    }, (reason: any) => {
      window.location.href = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN ?? '/';
    });
  }, []);

  return response;
}

export default useWhoAmI;