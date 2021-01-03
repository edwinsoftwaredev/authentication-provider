import React, { useEffect, useState } from 'react'
import RegistrationStyle from './Registration.module.scss';
import {Configuration, PublicApi, RegistrationFlow} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput';

const Registration: React.FC = () => {
  const [flowId, setFlowId] = useState<string>('');
  const [registrationFlow, setRegistrationFlow] = useState<RegistrationFlow>();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [usernameMessages, setUsernameMessages] =  useState<(string | undefined)[] | undefined>();
  const [emailMessages, setEmailMessages] =  useState<(string | undefined)[] | undefined>();
  const [passwordMessages, setPasswordMessages] =  useState<(string | undefined)[] | undefined>();
  const [nameMessages, setNameMessages] =  useState<(string | undefined)[] | undefined>();
  const [action, setAction] = useState<string>('');

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

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