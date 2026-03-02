import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useDashboardRoute } from '@hooks/useDashboardRoute.ts';
import { useDashboardDataProviderSync } from '@hooks/useDashboardDataProviderSync.ts';
import { useDataProviderStatistics } from '@hooks/useDataProviderStatistics.ts';
import { useHarvestingStatus } from '@features/indexing/hooks/useHarvestingStatus.ts';
import { useAuthStore } from '@/store/authStore.ts';
import { useCurrentUser } from '@hooks/useUser.ts';
import { DISABLED_TABS_WHEN_NO_METADATA } from '@components/Layout/menuItems.ts';
import { DEFAULT_DASHBOARD_PATH } from '@utils/routes.ts';
import '@/guards/styles.css';
import {LoadingOutlined} from '@ant-design/icons';

interface MetadataRestrictedRouteProps {
    children: ReactNode;
}

export const RestrictedRoute = ({ children }: MetadataRestrictedRouteProps) => {
    const { user } = useAuthStore();
    const { currentSubPath, buildPath } = useDashboardRoute();

    useCurrentUser();

    const {
        isLoading: isDataProvidersLoading,
        effectiveDataProviderId,
        selectedSetSpec,
    } = useDashboardDataProviderSync(user?.id ?? null);

    const { statistics, isLoading: statisticsIsLoading } = useDataProviderStatistics(
        effectiveDataProviderId ?? null,
        selectedSetSpec
    );

    const { harvestingStatus, isLoading: harvestingIsLoading } = useHarvestingStatus(
        false,
        effectiveDataProviderId ?? undefined
    );

    const shouldDisableTabs =
        harvestingStatus?.lastHarvestingDate == null || statistics?.countMetadata == null;

    const baseSubPath = currentSubPath?.split('/')[0] ?? '';
    const isDataReady = !statisticsIsLoading && !harvestingIsLoading;
    const isCurrentPathDisabled =
        isDataReady &&
        shouldDisableTabs &&
        DISABLED_TABS_WHEN_NO_METADATA.includes(baseSubPath);

    if (isDataProvidersLoading || !isDataReady) {
        return (
            <div
                className="metadata-restricted-loading"
                aria-label="Loading dashboard"
            >
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }

    if (isCurrentPathDisabled) {
        return (
            <Navigate
                to={buildPath(DEFAULT_DASHBOARD_PATH)}
                replace
            />
        );
    }

    return <>{children}</>;
};
