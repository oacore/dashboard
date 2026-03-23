import { useState } from 'react';
import { Alert, Button, Card, Form } from 'antd';
import { CrInput } from '@oacore/core-ui';
import { useNavigate } from 'react-router-dom';
import { useRegisterFromInvitation } from '@/hooks/useRegisterFromInvitation';
import './styles.css';

interface InvitationRegisterProps {
    email: string | null;
    invitationCode: string | null;
}

interface InvitationRegisterFormData {
    email: string;
    password: string;
    passwordAgain: string;
}

export const InvitationRegisterFeature = ({
    email,
    invitationCode,
}: InvitationRegisterProps) => {
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    const { registerFromInvitation, isLoading } = useRegisterFromInvitation();
    const navigate = useNavigate();

    const handleSubmit = async (values: InvitationRegisterFormData) => {
        setMessage(null);
        if (!invitationCode) {
            setMessage({
                type: 'error',
                text: 'Invitation code is missing. Please use the link from your invitation email.',
            });
            return;
        }

        const result = await registerFromInvitation({
            email: values.email,
            password: values.password,
            invitationCode,
        });

        if (result.success) {
            navigate('/login?reason=registration');
            return;
        }

        setMessage({
            type: 'error',
            text: result.message ?? 'Registration failed. Please try again.',
        });
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <Card className="login-card">
                    <h1 className="reset-title" aria-hidden>
                        Register from invitation
                    </h1>
                    <h2 className="auth-title">Register</h2>
                    <Form
                        name="invitation-register"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                        initialValues={{
                            email: email ?? undefined,
                        }}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <CrInput
                                label="Email"
                                placeholder="Enter email"
                                name="email"
                                id="invitation-email"
                                size="middle"
                                disabled={!!email}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    min: 8,
                                    message:
                                        'Password must be at least 8 characters!',
                                },
                                {
                                    max: 100,
                                    message:
                                        'Password must be at most 100 characters!',
                                },
                            ]}
                        >
                            <CrInput
                                label="Password"
                                placeholder="Enter password"
                                isPassword
                                name="password"
                                id="invitation-password"
                                size="middle"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            name="passwordAgain"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue('password') === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Passwords must match!')
                                        );
                                    },
                                }),
                            ]}
                        >
                            <CrInput
                                label="Confirm password"
                                placeholder="Enter password again"
                                isPassword
                                name="passwordAgain"
                                id="invitation-password-again"
                                size="middle"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="reset-button"
                                loading={isLoading}
                            >
                                Register
                            </Button>
                        </Form.Item>

                        {message && (
                            <Alert
                                description={message.text}
                                type={message.type}
                                showIcon={false}
                                className="reset-alert"
                            />
                        )}
                    </Form>
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
};
