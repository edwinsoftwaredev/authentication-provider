import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import {Configuration, LoginFlow, PublicApi} from '@oryd/kratos-client'
import style from './Login.module.scss';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput'
import AlertMessage from '../../shared/alert-message/AlertMessage';
import Button from '../../shared/button/button';

const Login: React.FC = () => {
  const [flowId, setFlowId] = useState<string | null>();
  const [loginFlow, setLoginFlow] = useState<LoginFlow>();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [usernameMessages, setUsernameMessages] = useState<(string | undefined)[] | undefined>();
  const [passwordMessages, setPasswordMessages] = useState<(string | undefined)[] | undefined>();
  const [flowMessages, setFlowMessages] = useState<(string | undefined)[] | undefined>();
  const location = useLocation();

  const handleSignUpClick = (e: any) => {
    const redir = process.env.REACT_APP_KRATOS_SELF_SERVICE_REGISTRATION; 
    if (redir) {
      window.location.href = redir;
    }
  }

  useEffect(() => {
    setFlowId(new URLSearchParams(location.search).get('flow'));
  }, [location]);

  useEffect(() => {
    const kratos =
      new PublicApi(new Configuration({basePath: process.env.REACT_APP_KRATOS_SERVER}));

    const getLoginFlow = async () => {
      const loginFlowVal =
        (await kratos.getSelfServiceLoginFlow(flowId as string)).data;

      setLoginFlow(loginFlowVal);
    }

    if (flowId) {
      getLoginFlow();
    }
  }, [flowId]);

  useEffect(() => {
    if (loginFlow) {
      setCsrfToken((loginFlow.methods.password.config.fields[2].value as object).toString());
      setAction(loginFlow.methods.password.config.action as string);
      setUsername((loginFlow.methods.password.config.fields[0].value as Object).toString());
      setUsernameMessages(loginFlow.methods.password.config.fields[0].messages?.map(value => value.text));
      setPasswordMessages(loginFlow.methods.password.config.fields[1].messages?.map(value => value.text));
      setFlowMessages(loginFlow.methods.password.config.messages?.map(value => value.text));
    }
  }, [loginFlow]);

  return (
    <div className={style['login-component']}>
      <div className={style['header']}>
        <div className={style['title']}>
          Authentication Provider
        </div>
        <div className={style['sub-title']}>
          Sign In
        </div>
      </div>
      <form 
        className={style['login-form']} 
        action={action}
        method='POST'
        encType="application/x-www-urlencoded"
      >
        <div className={style['form-fields']}>
          <input 
            type='hidden'
            name='csrf_token'
            value={csrfToken}
            required
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = usernameMessages ?? [''];
              setInputMessage(messages.join(', '), !messages, username);
            }}
            name='identifier'
            others={{fieldname: 'Username', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = passwordMessages ?? [''];
              setInputMessage(messages.join(', '), !messages, '');
            }}
            name='password'
            others={{fieldname: 'Password', autoComplete: 'off', type: 'password'}}
          />
          {
            flowMessages ? <AlertMessage message={flowMessages.join(', ')} type={'error'}/> : null
          }
          <div className={style['auth-buttons']}>
            <Button 
              classType={'default'}
              text={'Sign In'}
              type='submit'
            />
            <Button 
              classType={'default'}
              text={'Create New Account'}
              type='button'
              onClick={handleSignUpClick}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;