import React, { useEffect, useState } from 'react'
import style from './Registration.module.scss';
import {Configuration, FormField, PublicApi} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput';
import Button from '../../shared/button/button';
import AlertMessage from '../../shared/alert-message/AlertMessage';

const Registration: React.FC = () => {
  const [flowId, setFlowId] = useState<string>('');
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [usernameMessages, setUsernameMessages] =  useState<string>('');
  const [emailMessages, setEmailMessages] =  useState<string>('');
  const [passwordMessages, setPasswordMessages] =  useState<string>('');
  const [nameMessages, setNameMessages] =  useState<string>('');
  const [flowMessages, setFlowMessages] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  const location = useLocation();

  const handleSignInClick = () => {
    const redir = process.env.REACT_APP_KRATOS_SELF_SERVICE_LOGIN;
    if (redir) {
      window.location.href = redir;
    }
  };

  useEffect(() => {
    setFlowId(new URLSearchParams(location.search).get('flow') ?? '');
  }, [location])

  useEffect(() => {
    const kratos = new PublicApi(new Configuration({basePath: process.env.REACT_APP_KRATOS_SERVER}));

    const getRegistrationFlow = async (flowId: string) => {
      const registrationFlow = (await kratos.getSelfServiceRegistrationFlow(flowId)).data;
      const fields = registrationFlow.methods.password.config.fields;

      const getFieldValue = (name: string, fields: FormField[]): string => {
        return fields.find(field => field.name === name)?.value as string | undefined ?? '';
      };
      
      const getFieldMessages = (name: string, fields: FormField[]): string => {
        return fields.find(field => field.name === name)?.messages?.map(msg => msg.text).join(' ') as string | undefined ?? '';
      };

      setCsrfToken(getFieldValue('csrf_token', fields));
      setUsername(getFieldValue('traits.username', fields));
      setEmail(getFieldValue('traits.email', fields));
      setName(getFieldValue('traits.name', fields));

      setPasswordMessages(getFieldMessages('password', fields));
      setUsernameMessages(getFieldMessages('traits.username', fields));
      setEmailMessages(getFieldMessages('traits.email', fields));
      setNameMessages(getFieldMessages('traits.name', fields));

      setFlowMessages(
        registrationFlow
          .methods
          .password
          .config
          .messages
          ?.map(message => message.text).join(' ') ?? ''
      );

      setAction(registrationFlow.methods.password.config.action);

    }

    if (flowId) {
      getRegistrationFlow(flowId);
    }

  }, [flowId]);

  return (
    <div className={style['registration-component']}>
      <div className={style['header']}>
        <div className={style['title']}>
          Authentication Provider
        </div>
        <div className={style['sub-title']}>
          Sign Up
        </div>
      </div>
      <form 
        className={style['registration-form']}
        action={action}
        method='POST'
        encType='application/x-www-urlencoded'
      >
        <div className={style['form-fields']}>
          <input 
            className={style['form-field']}
            type='hidden'
            name='csrf_token'
            value={csrfToken}
            required
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              setInputMessage(emailMessages, !emailMessages, email);
            }}
            name='traits.email'
            others={{fieldname: 'E-Mail', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              setInputMessage(usernameMessages, !usernameMessages, username);
            }}
            name='traits.username'
            others={{fieldname: 'Username', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              setInputMessage(nameMessages, !nameMessages, name);
            }}
            name='traits.name'
            others={{fieldname: 'Name', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              setInputMessage(passwordMessages, !passwordMessages, '');
            }}
            name='password'
            others={{fieldname: 'Password', autoComplete: 'off', type: 'password'}}
          />
          {
            flowMessages ? <AlertMessage message={flowMessages} type={'error'}/> : null
          }
          <div className={style['auth-buttons']}>
            <Button
              classType={'default'}
              text='Sign Up'
              type='submit'
            />
            <Button
              classType={'default'}
              text='Do you already have an account?'
              type='button'
              onClick={handleSignInClick}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Registration;