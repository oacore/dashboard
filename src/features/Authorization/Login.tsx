import { Alert, Button, Card, Form, Spin } from 'antd';
import { CrInput } from '@oacore/core-ui';
import { useAuthStore } from '@/store/authStore.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./styles.css"
import { LoadingOutlined } from '@ant-design/icons';
import {CookiesView} from '@components/common/cookies/Cookies.tsx';

export const LoginFeature = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const continueUrl = searchParams.get('continue') || '/';
  const reason = searchParams.get('reason') || '';

  const onFinish = async (values: { email: string; password: string; remember_me: boolean }) => {
    try {
      await login(values.email, values.password, values.remember_me ?? true);
      navigate(continueUrl);
    } catch {
      // Error is handled by auth store and displayed via Alert
    }
  };

  const handleInputChange = () => {
    if (error) {
      clearError();
    }
  };

  const getReasonMessage = () => {
    switch (reason) {
      case 'wrong_credentials':
        return 'The username or password you entered is incorrect.';
      case 'logout_unexpectedly':
        return 'You have been logged out unexpectedly. Please log in again.';
      case 'logout':
        return 'You have been successfully logged out.';
      case 'registration':
        return 'You have been successfully registered. Please log in now.';
      case 'reset':
        return 'Your password has been reset successfully. Please log in now.';
      default:
        return '';
    }
  };

  const reasonMessage = getReasonMessage();



  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          {error && (
            <Alert
              description={error}
              type="error"
              closable={{ onClose: clearError }}
              className="login-alert"
            />
          )}
          {reasonMessage && (
            <Alert
              description={reasonMessage}
              type={reason === 'logout' || reason === 'registration' || reason === 'reset' ? 'success' : 'info'}
              className="login-alert"
            />
          )}
          <h1 className="auth-title">
            Login
          </h1>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
              ]}
            >
              <CrInput
                label={"Email"}
                placeholder={"Enter email"}
                onChange={handleInputChange}
                size={"middle"}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <CrInput
                label="Password"
                placeholder="Enter password"
                onChange={handleInputChange}
                isPassword={true}
                size="middle"
              />
            </Form.Item>


            <div className="auth-button-wrapper">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="auth-button"
                  loading={isLoading}
                  block
                >
                  {isLoading ? <Spin  indicator={<LoadingOutlined spin />} size="small" /> : 'Log In'}
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="redirect-button"
                  type="link"
                  htmlType="button"
                  onClick={() => navigate('/reset')}
                >
                  Forgotten password?
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>

        <div className="login-links">
          <a href="https://core.ac.uk/accessibility" target="_blank" rel="noopener noreferrer">
            Accessibility
          </a>
          <a href="https://core.ac.uk/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </div>
        <CookiesView />
      </div>
    </div>
  )
}
