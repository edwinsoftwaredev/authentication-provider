import React, { useEffect, useState } from 'react'
import style from './Registration.module.scss';
import {Configuration, PublicApi, RegistrationFlow} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput';
import Button from '../../shared/button/button';
import AlertMessage from '../../shared/alert-message/AlertMessage';

const Registration: React.FC = () => {
  const [flowId, setFlowId] = useState<string>('');
  const [registrationFlow, setRegistrationFlow] = useState<RegistrationFlow>();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [usernameMessages, setUsernameMessages] =  useState<(string | undefined)[] | undefined>();
  const [emailMessages, setEmailMessages] =  useState<(string | undefined)[] | undefined>();
  const [passwordMessages, setPasswordMessages] =  useState<(string | undefined)[] | undefined>();
  const [nameMessages, setNameMessages] =  useState<(string | undefined)[] | undefined>();
  const [flowMessages, setFlowMessages] = useState<(string | undefined)[] | undefined>();
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
      setRegistrationFlow(registrationFlow); 
    }

    if (flowId) {
      getRegistrationFlow(flowId);
    }

  }, [flowId]);

  useEffect(() => {
    if (registrationFlow) {
      setCsrfToken((registrationFlow.methods.password.config.fields[0].value ?? '') as string);
      setAction(registrationFlow.methods.password.config.action);
      const usernameTemp = registrationFlow
        .methods
        .password
        .config
        .fields
        .find(field => field.name === 'traits.username')
        ?.value;
      
      setUsername(usernameTemp ? usernameTemp.toString() : '');
      const emailTemp = registrationFlow
        .methods
        .password
        .config
        .fields
        .find(field => field.name === 'traits.email')
        ?.value;
      setEmail(emailTemp ? emailTemp.toString() : '');
      const nameTemp = registrationFlow
        .methods
        .password
        .config
        .fields
        .find(field => field.name === 'traits.name')
        ?.value;
      setName(nameTemp ? nameTemp.toString() : '');
      setPasswordMessages(
        registrationFlow
          .methods
          .password
          .config
          .fields
          .find(field => field.name === 'password')
          ?.messages
          ?.map(value => value.text)
      );
      setUsernameMessages(
        registrationFlow
          .methods
          .password
          .config
          .fields
          .find(field => field.name === 'traits.username')
          ?.messages
          ?.map(value => value.text)
      );
      setEmailMessages(
        registrationFlow
          .methods
          .password
          .config
          .fields
          .find(field => field.name === 'traits.email')
          ?.messages
          ?.map(value => value.text)
      );
      setNameMessages(
        registrationFlow
          .methods
          .password
          .config
          .fields
          .find(field => field.name === 'traits.name')
          ?.messages
          ?.map(value => value.text)
      );
      setFlowMessages(
        registrationFlow
          .methods
          .password
          .config
          .messages
          ?.map(message => message.text)
      )
    }
  }, [registrationFlow])

  return (
    <div className={style['registration-component']}>
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
              const messages = emailMessages ?? [''];
              setInputMessage(messages.join(', '), !messages, email);
            }}
            name='traits.email'
            others={{fieldname: 'E-Mail', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = usernameMessages ?? [''];
              setInputMessage(messages.join(', '), !messages, username);
            }}
            name='traits.username'
            others={{fieldname: 'Username', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = nameMessages ?? [''];
              setInputMessage(messages.join(', '), !messages, name);
            }}
            name='traits.name'
            others={{fieldname: 'Name', autoComplete: 'off'}}
          />
          <ValidatedTextInput 
            value={value => null}
            initialState={(setInputMessage) => {
              const messages = passwordMessages ?? [''];
              setInputMessage(messages.join('') ? ': ' + messages.join(', ') : '', !messages, '');
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