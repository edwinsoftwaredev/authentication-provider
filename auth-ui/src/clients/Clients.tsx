import React, { Fragment, useEffect, useState } from 'react';
import style from './Clients.module.scss';
import Axios from 'axios';
import Button from '../shared/button/button';

interface IUriList {
  list: string[]
}

const ClientUriList: React.FC<IUriList> = (props: IUriList) => {
  return (
    <Fragment>
      <ul>
        {
          props.list.map((uri, idx) => (
            <li key={idx}>{uri}</li>
          ))
        }
      </ul>
    </Fragment>
  )
};

interface IClientDataSection {
  title: string;
  list: string[]
}

const ClientDataSection: React.FC<IClientDataSection> = (props: IClientDataSection) => {
  return (
    <div className={style['redirect-uris']}>
      <div className={style['subtitle']}>
      {props.title}
      </div>
      <ClientUriList list={props.list} />
    </div>
  );
}

interface IClient {
  client_name: string;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  allowed_cors_origins: string[];
  grant_types: string[];
  response_types: string[];
  scope: string;
}

const ClientCard: React.FC<IClient> = (props: IClient) => {
  return (
    <div className={style['client-card']}>
      <div className={style['name']}>
        {props.client_name}
      </div>
      <hr />
      <ClientDataSection title='- Redirect Uris:' list={props.redirect_uris} />
      <ClientDataSection title='- Post Logout Redirect Uris:' list={props.post_logout_redirect_uris} />
      <ClientDataSection title='- Allowed CORS Origins:' list={props.allowed_cors_origins} />
      <ClientDataSection title='- Grant Types:' list={props.grant_types} />
      <ClientDataSection title='- Response Types:' list={props.response_types} />
      <ClientDataSection title='- Scope:' list={[props.scope]} />
      <hr />
      <Button classType='contained' text='Edit Client' type='button'/>
    </div>
  )
};

const Clients: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_AUTH_SERVER_URL}/api/clients/my-clients`, {
      withCredentials: true
    }).then(res => setClients(res.data));
  }, []);

  return (
    <div className={style['clients-component']}>
      <div className={style['header']}>
        <div className={style['title']}>
          My Clients
        </div>
        <Button 
          classType='contained'
          type='button'
          text='Create New Client'
        />
      </div>
      <div className={style['clients-container']}>
        {
          clients.map((client, idx) => (
            <ClientCard key={idx} 
              client_name={client.client_name}
              redirect_uris={client.redirect_uris}
              post_logout_redirect_uris={client.post_logout_redirect_uris}
              allowed_cors_origins={client.allowed_cors_origins}
              grant_types={client.grant_types}
              response_types={client.response_types}
              scope={client.scope}
            />
          ))
        }
      </div>
    </div>
  );
}

export default Clients;