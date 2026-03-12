import { useCallback } from 'react';
import Cookies from 'js-cookie';

const COOKIE_CONSENT_KEY = 'essential_cookies_allowed';
const ALL_COOKIES_CONSENT_KEY = 'all_cookies_allowed';

const COOKIE_ITEMS = [
  { name: 'essential', description: 'Essential cookies' },
  { name: 'analytics', description: 'Analytics cookies' },
  { name: 'marketing', description: 'Marketing cookies' },
] as const;

export const getCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(name);
};

export const useCookieItems = () => COOKIE_ITEMS;

export const useCookieHandler = () => {
  return useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = (e.currentTarget as HTMLButtonElement).id;
    if (typeof window === 'undefined') return;

    if (buttonId === COOKIE_CONSENT_KEY) {
      Cookies.set(COOKIE_CONSENT_KEY, 'true', { expires: 365 });
    } else if (buttonId === ALL_COOKIES_CONSENT_KEY) {
      Cookies.set(COOKIE_CONSENT_KEY, 'true', { expires: 365 });
      Cookies.set(ALL_COOKIES_CONSENT_KEY, 'true', { expires: 365 });
    }
  }, []);
};
