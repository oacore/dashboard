import { useMemo } from 'react';
import type { OrganisationData } from '@features/Settings/OrganisationalSettings/store/organisationStore.ts';

export const useBillingPlanData = <T,>(
    accumulatedData: T[],
    organisation: OrganisationData | undefined
) => {
    const isStartingPlan = organisation?.billingPlan?.billingType === 'starting';

    const displayData = useMemo(() => {
        if (isStartingPlan) {
            return accumulatedData.slice(0, 5);
        }
        return accumulatedData;
    }, [accumulatedData, isStartingPlan]);

    return {
        isStartingPlan,
        displayData,
    };
};
