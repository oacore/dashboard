import { useMemo } from 'react';
import type { DepositTimeLagItem } from './useDepositTimeLag';

const COMPLIANCE_THRESHOLD_DAYS = 90;

interface ComplianceLevelResult {
  complianceLevel: number | null;
  totalCount: number;
  nonCompliantCount: number;
}

export const useComplianceLevel = (
  timeLagData: DepositTimeLagItem[] | null | undefined
): ComplianceLevelResult => {
  return useMemo(() => {
    if (!timeLagData || timeLagData.length === 0) {
      return {
        complianceLevel: null,
        totalCount: 0,
        nonCompliantCount: 0,
      };
    }

    const totalCount = timeLagData.reduce((acc, curr) => acc + curr.worksCount, 0);
    const nonCompliantCount = timeLagData.reduce((acc, curr) => {
      if (curr.depositTimeLag > COMPLIANCE_THRESHOLD_DAYS) {
        return acc + curr.worksCount;
      }
      return acc;
    }, 0);

    if (totalCount === 0) {
      return {
        complianceLevel: 0,
        totalCount: 0,
        nonCompliantCount: 0,
      };
    }

    const level = ((totalCount - nonCompliantCount) / totalCount) * 100;
    const complianceLevel = Math.round(level * 100) / 100;

    return {
      complianceLevel,
      totalCount,
      nonCompliantCount,
    };
  }, [timeLagData]);
};
