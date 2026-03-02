import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/authStore.ts';
import { useUserDataProviders } from '@hooks/useDataProviders.ts';
import { ROUTES, DEFAULT_DASHBOARD_PATH } from '@utils/routes.ts';

type RootRedirectProps = {
    subPath?: string;
};

export const RootRedirect = ({ subPath }: RootRedirectProps) => {
    const { user } = useAuthStore();
    const { dataProviders, isLoading, isError } = useUserDataProviders(user?.id ?? null);

    const firstProvider = dataProviders?.[0];
    const redirectTo =
        firstProvider &&
        `${ROUTES.DATA_PROVIDERS}/${firstProvider.id}/${subPath ?? DEFAULT_DASHBOARD_PATH}`;

    if (isLoading || isError) {
        return (
            <div
                className="root-redirect-spinner"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return redirectTo ? (
        <Navigate to={redirectTo} replace />
    ) : (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Spin size="large" />
        </div>
    );
};
