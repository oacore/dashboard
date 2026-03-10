import { useEffect } from 'react';
import { Form, Button } from 'antd';
import { CrInput, CrPaper } from '@core/core-ui';
import { useChangePassword } from './hooks/useChangePassword';
import './styles.css';

interface ChangePasswordProps {
    className?: string;
    email?: string | null;
    token?: string | null;
    onSuccess?: () => void;
    variant?: 'default' | 'standalone';
}

interface ChangePasswordFormData {
    password?: string;
    newPassword: string;
    newPasswordAgain: string;
}

export const ChangePassword = ({ className, email, token, onSuccess, variant = 'default' }: ChangePasswordProps) => {
    const [form] = Form.useForm<ChangePasswordFormData>();
    const { changePassword, isChanging, error, successMessage, clearMessages } = useChangePassword();

    useEffect(() => {
        return () => {
            clearMessages();
        };
    }, [clearMessages]);

    const handleChangePassword = async (values: ChangePasswordFormData) => {
        if (!email) {
            return;
        }

        const result = await changePassword({
            email,
            password: values.password,
            newPassword: values.newPassword,
            newPasswordAgain: values.newPasswordAgain,
            token: token ?? undefined,
        });

        if (result.type === 'success') {
            form.resetFields();
            onSuccess?.();
        }
    };

    const messageText = successMessage || error || '';
    const messageType = successMessage ? 'success' : error ? 'error' : '';

    const cardTitle = email ? (
        <div>
            Change password for <span className="change-password-email">{email}</span>
        </div>
    ) : (
        <div>Reset password</div>
    );

    const Wrapper = variant === 'standalone' ? 'div' : CrPaper;
    const wrapperClassName = variant === 'standalone' ? '' : 'access-users-section';

    return (
        <Wrapper className={wrapperClassName}>
            <div className={className}>
                <div className="header-wrapper">
                    <h2 className="header-wrapper-title">{cardTitle}</h2>
                </div>
                <div className="change-password-form-wrapper">
                    {messageText && (
                        <div className={`change-password-message ${messageType === 'success' ? 'success' : 'error'}`}>
                            {messageText}
                        </div>
                    )}
                    <Form
                        form={form}
                        name="password-form"
                        onFinish={handleChangePassword}
                        layout="vertical"
                        className="change-password-form"
                    >
                        {!token && (
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your current password!' },
                                ]}
                            >
                                <CrInput
                                    label="Password"
                                    isPassword={true}
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Please input your new password!' },
                                { min: 8, message: 'Password must be at least 8 characters!' },
                                { max: 100, message: 'Password must be at most 100 characters!' },
                            ]}
                        >
                            <CrInput
                                label="New password"
                                isPassword={true}
                                placeholder="Enter Password"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPasswordAgain"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords must match!'));
                                    },
                                }),
                            ]}
                        >
                            <CrInput
                                label="Repeat password"
                                isPassword={true}
                                placeholder="Enter Password"
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isChanging}
                                className="change-password-submit-button"
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Wrapper>
    );
};

