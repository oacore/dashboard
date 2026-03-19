import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Card } from 'antd';
import { InvitationRegisterFeature } from '@features/Authorization/InvitationRegister';
import '@features/Authorization/styles.css';

export const InvitationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const invitationCode = searchParams.get('invitationCode');

    const hasValidParams = invitationCode && email;

    if (!hasValidParams) {
        return (
            <div className="login-container">
                <div className="login-content">
                    <Card className="login-card create-password-card-invalid">
                        <h1 className="reset-title" aria-hidden>
                            Register from invitation
                        </h1>
                        <Alert
                            description="Invalid invitation link. Please use the link from your invitation email. If the link has expired, please contact your organisation administrator."
                            type="error"
                            showIcon={false}
                            className="reset-alert create-password-invalid-alert"
                        />
                        <div className="create-password-invalid-links">
                            <Link to="/login">Go to login</Link>
                        </div>
                    </Card>
                    <div className="login-links">
                        <a
                            href="https://core.ac.uk/accessibility"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Accessibility
                        </a>
                        <a
                            href="https://core.ac.uk/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <InvitationRegisterFeature
            email={email}
            invitationCode={invitationCode}
        />
    );
};
