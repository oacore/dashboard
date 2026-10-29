import { useMemo } from 'react';
import type { OrganisationData } from '@features/Settings/OrganisationalSettings/store/organisationStore.ts';

export const useBillingPlanData = <T,>(
    accumulatedData: T[],
    organisation: OrganisationData | undefined
) => {
    const isStartingPlan = organisation?.billingPlan?.billingType === 'starting';

    const displayData = useMemo(() => {
        const rows = Array.isArray(accumulatedData) ? accumulatedData : [];
        if (isStartingPlan) {
            return rows.slice(0, 5);
        }
        return rows;
    }, [accumulatedData, isStartingPlan]);

    return {
        isStartingPlan,
        displayData,
    };
};
