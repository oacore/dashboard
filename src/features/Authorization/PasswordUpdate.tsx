import {Alert, Card} from 'antd';
import {ChangePassword} from '@components/common/ChangePassword';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import "./styles.css"

export const PasswordUpdateFeature = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email') ?? undefined;

  const handleSuccess = () => {
    navigate('/login?reason=reset');
  };

  const hasValidParams = token && email;

  if (!hasValidParams) {
    return (
      <div className="create-password-container">
        <div className="create-password-content">
          <Card className="create-password-card create-password-card-invalid">
            <h1 className="create-password-title" aria-hidden>
              Password reset
            </h1>
            <Alert
              description="Invalid reset link. Please request a new password reset."
              type="error"
              showIcon={false}
              className="create-password-invalid-alert"
            />
            <div className="create-password-invalid-links">
              <Link to="/reset">Request password reset</Link>
            </div>
          </Card>
          <div className="create-password-links">
            <a href="https://core.ac.uk/accessibility" target="_blank" rel="noopener noreferrer">
              Accessibility
            </a>
            <a href="https://core.ac.uk/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-password-container">
      <div className="create-password-content">
        <Card className="create-password-card">
          <h1 className="create-password-title" aria-hidden>
            Password reset
          </h1>
          <ChangePassword
            className="create-password-form-wrapper"
            email={email}
            token={token ?? undefined}
            onSuccess={handleSuccess}
            variant="standalone"
          />
        </Card>
        <div className="create-password-links">
          <a href="https://core.ac.uk/accessibility" target="_blank" rel="noopener noreferrer">
            Accessibility
          </a>
          <a href="https://core.ac.uk/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
