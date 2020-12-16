import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import {Configuration, LoginFlow, PublicApi} from '@oryd/kratos-client'

const Login: React.FC = () => {
    const [flowId, setFlowId] = useState<string | null>();
    const [loginFlow, setLoginFlow] = useState<LoginFlow>();
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

    return (
        <div>login works</div>
    );
}

export default Login;