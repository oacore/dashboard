import * as Sentry from '@sentry/react';

export type CaptureHandledErrorContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

/**
 * Send an error from a try/catch block to Sentry. Global handlers in main.tsx
 * only see uncaught / React-handled errors; caught errors must be reported explicitly.
 */
export const captureHandledError = (
  error: unknown,
  context?: CaptureHandledErrorContext,
): void => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.captureException(error, {
    tags: {
      error_handling: 'try_catch',
      ...context?.tags,
    },
    ...(context?.extra !== undefined && { extra: context.extra }),
  });
};
