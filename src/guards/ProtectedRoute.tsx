import  { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.ts';
import { Spin } from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Check authentication status when component mounts
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin  indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }

    if (!isAuthenticated) {
        const continueUrl = encodeURIComponent(location.pathname + location.search);
        return (
            <Navigate
                to={`/login?continue=${continueUrl}&reason=logout_unexpectedly`}
                replace
            />
        );
    }

    return <>{children}</>;
};
