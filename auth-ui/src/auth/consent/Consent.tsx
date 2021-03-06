import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../../shared/button/button';
import style from './Consent.module.scss';
import Axios from 'axios';

const Consent: React.FC = () => {
  const location = useLocation();
  const data: any = location.state;
  const history = useHistory();

  useEffect(() => {
    if (!data) {
      history.push('/');
    }
  }, [data, history]);

  const handleAllowClick = () => {
    if (data) {
      Axios.post(`${process.env.REACT_APP_AUTH_SERVER_CONSENT_CHALLENGE}`,
      {
        consentChallenge: data.challenge
      }, {withCredentials: true})
      .then(res => {
        window.location.href = res.data.redirectUrl;
      });
    }
  };

  const handleCancelClick = () => {
    if (data) {
      Axios.post(`${process.env.REACT_APP_AUTH_SERVER_REJECT_CONSENT_CHALLENGE}`,
      {
        consentChallenge: data.challenge
      }, {withCredentials: true})
      .then(res => {
        window.location.href = res.data.redirectUrl;
      });
    }
  };

  return (
    <div className={style['consent-container']}>
      {
        data ? (
          <div className={style['consent']}>
            <div className={style['header']}>
              <span className={style['client-name']}>{data ? data.client : ''} </span>
              wants to access your account
            </div>
            <div className={style['body']}>
              <div>
                This will allow
                <span className={style['client-name']}> {data ? data.client : ''} </span>
                to access your account with the following scopes:
              </div>
              <div className={style['scopes']}>
                <ul>
                  {
                    data ? data.requested_scope.map((item: any, index: any) => {
                      return <li key={index}>{item}</li>
                    }) : null
                  }
                </ul>
              </div>
            </div>
            <div className={style['important-note']}>
              Make sure you trust 
              <span className={style['client-name']}> {data ? data.client : ''} </span>
              <div className={style['note']}>
                  You may be sharing sensitive info with this site or app.
              </div>
            </div>
            <div className={style['footer']}>
              <div className={style['buttons']}>
                  <Button
                    classType='default'
                    type='button'
                    text='Cancel' 
                    onClick={handleCancelClick}
                  />
                  <div></div>
                  <Button
                    classType='contained'
                    type='button'
                    text='Allow' 
                    onClick={handleAllowClick}
                  />
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

export default Consent;