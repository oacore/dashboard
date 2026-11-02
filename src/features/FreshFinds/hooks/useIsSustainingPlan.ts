import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

const isSustainingBillingType = (billingType: string | null | undefined) =>
  billingType?.trim().toLowerCase() === 'sustaining';

export const useIsSustainingPlan = () => {
  const { organisation, isLoadingOrganisation } = useOrganisation();
  const isSustainingPlan = isSustainingBillingType(organisation?.billingPlan?.billingType);

  return {
    isSustainingPlan,
    isLoadingOrganisation,
  };
};
