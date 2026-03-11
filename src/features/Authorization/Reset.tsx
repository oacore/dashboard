import {useState} from 'react';
import {useRequestResetToken} from '@hooks/useRequestResetToken.ts';
import "./styles.css"
import { Card, Form, Button, Alert } from 'antd';
import { CrInput } from '@oacore/core-ui';
export const ResetFeature= () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { requestResetToken, isLoading } = useRequestResetToken();

  const handleSubmit = async (values: { email: string }) => {
    setMessage(null);
    const result = await requestResetToken(values.email);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
  };

  return(
  <div className="login-container">
    <div className="login-content">
      <Card className="login-card">
        <h1 className="reset-title" aria-hidden>
          Password reset
        </h1>
        <h2 className="auth-title">Reset password</h2>
        <Form
          name="reset"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <CrInput
              label="Email"
              placeholder="Enter email"
              name="email"
              id="reset-email"
              size="middle"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="reset-button"
              loading={isLoading}
            >
              Continue
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
    </div>
  </div>
)
}
