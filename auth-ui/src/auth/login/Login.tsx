import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import {Configuration, LoginFlow, PublicApi} from '@oryd/kratos-client'
import LoginStyle from './Login.module.scss';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput'

const Login: React.FC = () => {
  const [flowId, setFlowId] = useState<string | null>();
  const [loginFlow, setLoginFlow] = useState<LoginFlow>();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [usernameMessages, setUsernameMessages] = useState<(string | undefined)[] | undefined>();
  const [passwordMessages, setPasswordMessages] = useState<(string | undefined)[] | undefined>();
  const [flowMessages, setFlowMessages] = useState<(string | undefined)[] | undefined>();
  const location = useLocation();


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
      setUsernameMessages(loginFlow.methods.password.config.fields[0].messages?.map(value => value.text));
      setPasswordMessages(loginFlow.methods.password.config.fields[1].messages?.map(value => value.text));
      setFlowMessages(loginFlow.methods.password.config.messages?.map(value => value.text));
    }
  }, [loginFlow]);

  return (
    <div className={LoginStyle['login-component']}>
      <form 
        className={LoginStyle['login-form']} 
        action={action}
        method='POST'
        encType="application/x-www-urlencoded"
      >
        <div className={LoginStyle['form-fields']}>
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
              setInputMessage(messages.join(', '), !messages);
            }}
            name='identifier'
            others={{fieldname: 'Username', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = passwordMessages ?? [''];
              setInputMessage(messages.join(', '), !messages);
            }}
            name='password'
            others={{fieldname: 'Password', autoComplete: 'off', type: 'password'}}
          />
          <br />
          {
            flowMessages ? <div>{flowMessages.join(', ')}</div> : null
          }
          <button
            className={LoginStyle['btn-login']}
            type='submit'
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;