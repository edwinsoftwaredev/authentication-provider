import React, { useEffect, useState } from 'react';
import {Configuration, FormField, PublicApi} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput';
import style from './Recovery.module.scss';
import AlertMessage from '../../shared/alert-message/AlertMessage';
import Button from '../../shared/button/button';

const Recovery: React.FC = () => {
  const [flowId, setFlowId] = useState<string>('');
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [emailMessages, setEmailMessages] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [flowMessages, setFlowMessages] = useState<string>('');
  const [flowAction, setFlowAction] = useState<string>('');

  const location = useLocation();

  useEffect(() => {
    setFlowId(new URLSearchParams(location.search).get('flow') ?? '');
  }, [location]);

  useEffect(() => {
    const kratos = new PublicApi(
      new Configuration({basePath: process.env.REACT_APP_KRATOS_SERVER})
    );

    const getRecoveryFlow = async (flow: string) => {
      const recoveryFlow = (await kratos.getSelfServiceRecoveryFlow(flow)).data;
      const fields = recoveryFlow.methods.link.config.fields;

      const getFieldValue = (name: string, fields: FormField[]): string => {
        return fields.find(field => field.name === name)?.value as string | undefined ?? '';
      };

      const getFieldMessages = (name: string, fields: FormField[]): string => {
        return fields.find(field => field.name === name)?.messages?.map(msg => msg.text).join(' ') as string | undefined ?? '';
      };

      setCsrfToken(getFieldValue('csrf_token', fields));
      setEmail(getFieldValue('email', fields));
      setEmailMessages(getFieldMessages('email', fields));

      setFlowMessages(recoveryFlow.methods.link.config.messages?.map(msg => msg.text).join(' ') ?? '');
      setFlowAction(recoveryFlow.methods.link.config.action);
    }

    if (flowId) {
      getRecoveryFlow(flowId);
    }
  }, [flowId]);

  return (
    <div className={style['recovery-component']}>
      <div className={style['header']}>
        Authentication Provider
      </div>
      <div className={style['sub-header']}>
        Account Recovery
      </div>
      <form 
        className={style['recovery-form']}
        action={flowAction}
        method='POST'
        encType='application/x-www-urlencoded'
      >
        <input
          type='hidden'
          value={csrfToken}
          name='csrf_token'
          required
        />
        <ValidatedTextInput
          value={value => null}
          initialState={
            (setInputMessage) => setInputMessage(emailMessages, !emailMessages, email)
          }
          name='email'
          others={{fieldname: 'E-Mail', autoComplete: 'off', type: 'email'}}
        />
        {
          flowMessages ? <AlertMessage message={flowMessages} type='error' /> : null
        }
        <div className={style['recovery-form-buttons']}>
          <Button
            classType='default'
            text='Submit'
            type='submit' 
          />
        </div>
      </form>
    </div>
  );
};

export default Recovery;