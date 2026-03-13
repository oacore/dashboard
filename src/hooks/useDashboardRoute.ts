import { useCallback } from 'react';
import { useParams, useMatch, generatePath } from 'react-router-dom';
import {
    DEFAULT_DASHBOARD_PATH,
    DATA_PROVIDER_DASHBOARD_PATTERN,
} from '@/utils/routes';

export const useDashboardRoute = () => {
    const { dataProviderId } = useParams<{ dataProviderId: string }>();
    const match = useMatch(DATA_PROVIDER_DASHBOARD_PATTERN);

    const buildPath = useCallback(
        (subPath: string, providerId?: number | string) => {
            const id = providerId ?? dataProviderId;
            if (!id) return `/${subPath}`;
            return generatePath(DATA_PROVIDER_DASHBOARD_PATTERN, {
                dataProviderId: String(id),
                '*': subPath,
            });
        },
        [dataProviderId]
    );

    const currentSubPath = match?.params['*'] || DEFAULT_DASHBOARD_PATH;
    const dataProviderIdNum = dataProviderId ? parseInt(dataProviderId, 10) : null;

    return {
        dataProviderId: dataProviderIdNum,
        dataProviderIdStr: dataProviderId ?? null,
        buildPath,
        currentSubPath,
    };
};
