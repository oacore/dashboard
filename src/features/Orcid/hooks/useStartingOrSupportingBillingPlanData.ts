import { useMemo } from 'react';
import type { OrganisationData } from '@features/Settings/OrganisationalSettings/store/organisationStore.ts';

const isStartingOrSupportingBillingType = (billingType: string | null | undefined) =>
    billingType === 'starting' || billingType === 'supporting';

export const useStartingOrSupportingBillingPlanData = <T,>(
    accumulatedData: T[],
    organisation: OrganisationData | undefined
) => {
    const isStartingOrSupportingPlan = isStartingOrSupportingBillingType(
        organisation?.billingPlan?.billingType
    );

    const displayData = useMemo(() => {
        if (isStartingOrSupportingPlan) {
            return accumulatedData.slice(0, 5);
        }
        return accumulatedData;
    }, [accumulatedData, isStartingOrSupportingPlan]);

    return {
        isStartingOrSupportingPlan,
        displayData,
    };
};
