import { useEffect, useState } from "react"
import Axios, { AxiosResponse } from 'axios';

export enum WhoAmIStatus {
  NotFetched,
  Active,
  NotActive,
  NotAuthorized
}

export interface IUser {
  active: WhoAmIStatus;
  traits: {
    email: string;
    name: string;
    username: string;
    picture: string;
  }
}

const useWhoAmI = () => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_AUTH_SERVER_WHOAMI}`,
      {withCredentials: true}
    ).then((res: AxiosResponse<IUser>) => {
      if (res.data.active) {
        setUser({...res.data, active: WhoAmIStatus.Active});
      } else {
        setUser({...res.data, active: WhoAmIStatus.NotActive});
      }
    }, reason => setUser({active: WhoAmIStatus.NotAuthorized} as IUser));
  }, []);

  return user;
}

export default useWhoAmI;