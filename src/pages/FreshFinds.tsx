import { Navigate } from 'react-router-dom';
import { useDocumentTitle } from '@hooks/useDocumentTitle.ts';
import { FreshFindsFeature } from '@features/FreshFinds/FreshFindsFeature.tsx';
import { useCanViewFreshFinds } from '@features/FreshFinds/hooks/useCanViewFreshFinds.ts';
import { useDashboardRoute } from '@hooks/useDashboardRoute.ts';
import { DEFAULT_DASHBOARD_PATH } from '@utils/routes.ts';

export function FreshFindsPage() {
  useDocumentTitle('Fresh finds');
  const { buildPath } = useDashboardRoute();
  const { canViewFreshFinds, isResolvingAccess } = useCanViewFreshFinds();

  if (isResolvingAccess) {
    return null;
  }

  if (!canViewFreshFinds) {
    return <Navigate to={buildPath(DEFAULT_DASHBOARD_PATH)} replace />;
  }

  return <FreshFindsFeature />;
}
