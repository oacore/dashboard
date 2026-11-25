import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useDashboardRoute } from '@hooks/useDashboardRoute.ts';
import { canAccessFreshFeature, canViewFreshFinds } from '@config/tempFeatureAccess.ts';

export const useCanViewFreshFinds = () => {
  const { dataProviderId } = useDashboardRoute();
  const { organisation, isLoadingOrganisation } = useOrganisation();
  const isAllowlisted = canAccessFreshFeature(dataProviderId);
  const billingType = organisation?.billingPlan?.billingType;

  return {
    canViewFreshFinds: canViewFreshFinds(dataProviderId, billingType),
    isResolvingAccess: !isAllowlisted && isLoadingOrganisation,
  };
};
