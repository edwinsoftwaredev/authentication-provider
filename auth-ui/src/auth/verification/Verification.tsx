import React from 'react';
import VerificationStyle from './Verification.module.scss';

const Verification: React.FC = () => {
    return (
        <div className={VerificationStyle['verification-component']}>
            <div className={VerificationStyle['verification-status']}>
                Verification Successful!
            </div>
            <div className={VerificationStyle['redirection-message']}>
                Redirecting to login page...
            </div>
        </div>
    );
};

export default Verification;