import React, { Fragment, useState } from 'react';
import style from './AlertMessage.module.scss';

interface IAlertMessage {
    message: string,
    type: string
}

const AlertMessage: React.FC<IAlertMessage> = (props: IAlertMessage) => {
    const [closed, setClosed] = useState(false);

    if (closed) {
        return null;
    }

    const handleClose = () => {
        setClosed(true);
    };

    return (
        <Fragment>
            <div className={style['alert-message-container'] + ' ' + style[props.type]}>
                <div className={style['message']}>
                    {props.message}
                </div>
                <div className={style['right-container']}>
                    <button onClick={handleClose} className={style['close-button']}>x</button>
                </div>
            </div>
        </Fragment>
    );
};

export default AlertMessage;