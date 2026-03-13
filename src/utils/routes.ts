export const ROUTES = {
    DATA_PROVIDERS: '/data-providers',
    LOGIN: '/login',
    RESET: '/reset',
} as const;

export const DATA_PROVIDER_DASHBOARD_PATTERN = '/data-providers/:dataProviderId/*';

export const DEFAULT_DASHBOARD_PATH = 'overview';
