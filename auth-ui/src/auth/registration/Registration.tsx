import React, { useEffect, useState } from 'react'
import RegistrationStyle from './Registration.module.scss';
import {Configuration, PublicApi, RegistrationFlow} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';

const Registration: React.FC = () => {
  const [flowId, setFlowId] = useState<string>('');
  const [registrationFlow, setRegistrationFlow] = useState<RegistrationFlow>();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [usernameMessages, setUsernameMessages] =  useState<(string | undefined)[] | undefined>();
  const [emailMessages, setEmailMessages] =  useState<(string | undefined)[] | undefined>();
  const [passwordMessages, setPasswordMessages] =  useState<(string | undefined)[] | undefined>();
  const [nameMessages, setNameMessages] =  useState<(string | undefined)[] | undefined>();
  const [action, setAction] = useState<string>('');

  const location = useLocation();

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
    }
  }, [registrationFlow])

  return (
    <div className={RegistrationStyle['registration-component']}>
      <form 
        className={RegistrationStyle['registration-form']}
        action={action}
        method='POST'
        encType='application/x-www-urlencoded'
      >
        <div className={RegistrationStyle['form-fields']}>
          <input 
            className={RegistrationStyle['form-field']}
            type='hidden'
            name='csrf_token'
            value={csrfToken}
            required
          />
          <input
            className={RegistrationStyle['form-field']}
            type='email'
            name='traits.email'
            autoComplete='off'
            placeholder='E-Mail'
          />
          {
            emailMessages ? <div>{emailMessages.join(', ')}</div> : null
          }
          <input
            className={RegistrationStyle['form-field']}
            type='text'
            name='traits.username'
            autoComplete='off'
            placeholder='Username' 
          />
          {
              usernameMessages ? <div>{usernameMessages.join(', ')}</div> : null
          }
          <input
            className={RegistrationStyle['form-field']}
            type='text'
            name='traits.name'
            placeholder='Name'
            autoComplete='off' 
          />
          {
            nameMessages ? <div>{nameMessages.join(', ')}</div> : null
          }
          <input
            className={RegistrationStyle['form-field']}
            type='password'
            name='password'
            placeholder='Password'
            required
          />
          {
            passwordMessages ? <div>{passwordMessages.join(', ')}</div> : null
          }
          <button
            className={RegistrationStyle['btn-submit']}
            type='submit'
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default Registration;