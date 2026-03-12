/**
 * Callback registry for 401 Unauthorized responses.
 * Used to avoid circular imports between axios and authStore.
 * Handler clears auth state and redirects to login without making additional API calls.
 */
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void): void => {
    unauthorizedHandler = handler;
};

export const handleUnauthorized = (): void => {
    if (unauthorizedHandler) {
        unauthorizedHandler();
    }
};
