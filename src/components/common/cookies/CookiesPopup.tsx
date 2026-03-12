import React from 'react';
import { Button } from 'antd';
import './cookies.css';

const COOKIE_CONSENT_KEY = 'essential_cookies_allowed';
const ALL_COOKIES_CONSENT_KEY = 'all_cookies_allowed';

type CookiesPopupProps = {
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CookiesPopup: React.FC<CookiesPopupProps> = ({ onSubmit }) => (
  <div
    className="cookies-popup"
    id="cookies-popup"
    role="dialog"
    aria-label="Cookie consent"
  >
    <div className="cookies-popup-body">
      <p>We use cookies to improve our website.</p>
      <a
        href="https://core.ac.uk/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="cookies-popup-link"
        tabIndex={0}
        aria-label="Learn more about our privacy policy"
      >
        Learn more
      </a>
    </div>
    <div className="cookies-popup-actions">
      <Button
        onClick={onSubmit}
        className="cookies-popup-button"
        id={COOKIE_CONSENT_KEY}
        tabIndex={0}
        aria-label="Accept essential cookies only"
      >
        Essential cookies only
      </Button>
      <Button
        type="primary"
        onClick={onSubmit}
        className="cookies-popup-button"
        id={ALL_COOKIES_CONSENT_KEY}
        tabIndex={0}
        aria-label="Accept all cookies"
      >
        I agree
      </Button>
    </div>
  </div>
);
