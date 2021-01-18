import { useEffect, useState } from "react"
import Axios from 'axios';

export enum WhoAmIStatus {
  NotFetched,
  Active,
  NotActive,
  NotAuthorized
}

const useWhoAmI = () => {
  const [isUserActive, setIsUserActive] = useState<WhoAmIStatus>(WhoAmIStatus.NotFetched);

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_AUTH_SERVER_WHOAMI}`,
      {withCredentials: true}
    ).then(res => {
      if (res.data.active) {
        setIsUserActive(WhoAmIStatus.Active);
      } else {
        setIsUserActive(WhoAmIStatus.NotActive);
      }
    }, reason => setIsUserActive(WhoAmIStatus.NotAuthorized));
  }, []);

  return isUserActive;
}

export default useWhoAmI;