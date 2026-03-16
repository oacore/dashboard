import { useCallback, useState, useEffect } from 'react';
import { getCookie, useCookieHandler } from '@/hooks/useCookies';
import {CookiesPopup} from '@components/common/cookies/CookiesPopup.tsx';

const COOKIE_CONSENT_KEY = 'essential_cookies_allowed';

export const CookiesView = () => {
  const cookieHandler = useCookieHandler();
  const [visibleCookiePopup, setVisibleCookiePopup] = useState(
    () => !getCookie(COOKIE_CONSENT_KEY)
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/cookies') {
      setVisibleCookiePopup(false);
    }
  }, []);

  const handleAcceptCookies = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setVisibleCookiePopup(false);
      cookieHandler(e);
    },
    [cookieHandler]
  );

  if (!visibleCookiePopup || typeof window === 'undefined') {
    return null;
  }

  return <CookiesPopup onSubmit={handleAcceptCookies} />;
};

