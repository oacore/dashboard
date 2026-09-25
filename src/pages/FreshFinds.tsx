import { Navigate } from 'react-router-dom';
import { useDocumentTitle } from '@hooks/useDocumentTitle.ts';
import { FreshFindsFeature } from '@features/FreshFinds/FreshFindsFeature.tsx';
import { useDashboardRoute } from '@hooks/useDashboardRoute.ts';
import { canAccessLimitedFeature } from '@config/tempFeatureAccess.ts';
import { DEFAULT_DASHBOARD_PATH } from '@utils/routes.ts';

export function FreshFindsPage() {
  useDocumentTitle('Fresh finds');
  const { dataProviderId, buildPath } = useDashboardRoute();

  if (!canAccessLimitedFeature(dataProviderId)) {
    return <Navigate to={buildPath(DEFAULT_DASHBOARD_PATH)} replace />;
  }

  return <FreshFindsFeature />;
}
