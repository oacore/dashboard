/** Fresh-finds is served from production API while the dashboard may use api-dev elsewhere. */
export const FRESH_FINDS_PUBLIC_API_ORIGIN = 'https://api.core.ac.uk';

export const buildFreshFindsInternalUrl = (dataProviderId: number): string =>
    `${FRESH_FINDS_PUBLIC_API_ORIGIN}/internal/data-providers/${dataProviderId}/fresh-finds`;
