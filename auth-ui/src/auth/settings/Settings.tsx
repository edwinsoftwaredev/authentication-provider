import React, { useEffect, useState } from 'react';
import {Configuration, FormField, PublicApi, SettingsFlow} from '@oryd/kratos-client';
import { useLocation } from 'react-router-dom';
import style from './Settings.module.scss';
import ValidatedTextInput from '../../shared/validated-input/ValidatedTextInput';
import Button from '../../shared/button/button';
import AlertMessage from '../../shared/alert-message/AlertMessage';

const getFieldMessage =
  <T,>(
    fields: FormField[],
    name: string,
    setState: React.Dispatch<React.SetStateAction<T | string>>
  ) => {
    const value = fields.find(field => field.name === name)?.messages?.join(' ');
    setState(value ?? '');
};

const getFieldValue =
  <T,>(
    fields: FormField[],
    name: string, 
    setState: React.Dispatch<React.SetStateAction<T | string>>
  ) => {
  const value = fields.find(field => field.name === name)?.value as T | undefined;
  setState(value ?? '');
} 

const Settings: React.FC = () => {
  const [settingsFlow, setSettingsFlow] = useState<SettingsFlow>();
  const [profileCsrf, setProfileCsrf] = useState<string>('');
  const [profileName, setProfileName] = useState<string>('');
  const [profileNameMsg, setProfileNameMsg] = useState<string>('');
  const [profileUsername, setProfileUsername] = useState<string>('');
  const [profileUsernameMsg, setProfileUsernameMsg] = useState<string>('');
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [profileEmailMsg, setProfileEmailMsg] = useState<string>('');
  const [profileAction, setProfileAction] = useState<string>('');
  const [profileMsg, setProfileMsg] = useState<string>('');

  const location = useLocation();

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    const settingFlow = urlSearch.get('flow');

    const kratosInstance =
      new PublicApi(new Configuration({basePath: process.env.REACT_APP_KRATOS_SERVER}));

    const getSettingsPayload = async (flow: string) => {
      kratosInstance.getSelfServiceSettingsFlow(flow, {withCredentials: true})
        .then(res => {
          setSettingsFlow(res.data);
        });
    };

    if (settingFlow) {
      getSettingsPayload(settingFlow);
    }

  }, [location]);

  useEffect(() => {
    if (settingsFlow) {
      const fields = settingsFlow.methods.profile.config.fields;
      const profileAction = settingsFlow.methods.profile.config.action;
      setProfileAction(profileAction ?? '');

      const profileMsg = settingsFlow.methods.profile.config.messages?.join(' ');
      setProfileMsg(profileMsg ?? '');

      getFieldValue<string>(fields, 'csrf_token', setProfileCsrf);

      getFieldValue<string>(fields, 'traits.name', setProfileName);
      getFieldMessage<string>(fields, 'traits.name', setProfileNameMsg);
      
      getFieldValue<string>(fields, 'traits.username', setProfileUsername);
      getFieldMessage<string>(fields, 'traits.username', setProfileUsernameMsg);

      getFieldValue<string>(fields, 'traits.email', setProfileEmail);
      getFieldMessage<string>(fields, 'traits.email', setProfileEmailMsg);

    }
  }, [settingsFlow]);

  return (
    <div className={style['settings-container']}>
      <div className={style['form-container']}>
        <div className={style['title']}>Profile</div>
        <form
          action={profileAction}
          method='POST'
          encType="application/x-www-urlencoded"
        >
          <input 
            value={profileCsrf}
            type='hidden'
            name='csrf_token'
            required
          />
          <ValidatedTextInput
            name='traits.name'
            value={value => null}
            initialState={
              (setInputState) => {
                setInputState(profileNameMsg, !profileNameMsg, profileName)
              }
            }
            others={{fieldname: 'Name', autoComplete: 'off'}}
          />
          <ValidatedTextInput
            name='traits.username'
            value={value => null}
            initialState={
              (setInputState) => {
                setInputState(profileUsernameMsg, !profileUsernameMsg, profileUsername)
              }
            }
            others={{fieldname: 'Username', autoComplete: 'off'}}
          />
          <ValidatedTextInput
            name='traits.email'
            value={value => null}
            initialState={
              (setInputState) => {
                setInputState(profileEmailMsg, !profileEmailMsg, profileEmail)
              }
            }
            others={{fieldname: 'Email', autoComplete: 'off'}}
          />
          {
            profileMsg ? <AlertMessage message={profileMsg} type={'error'}/> : null
          }
          <div className={style['form-buttons']}>
            <Button
              classType='contained'
              type='submit'
              text='Save' 
            />
          </div>
        </form>
        <form>
          
        </form>
      </div>
    </div>
  )
};

export default Settings;