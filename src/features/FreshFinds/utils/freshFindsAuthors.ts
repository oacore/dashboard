import type { FreshFindsAffiliationInfo } from '../types/data.types';

export const formatFreshFindsAuthors = (
  affiliationInfo: FreshFindsAffiliationInfo[] | undefined,
): string => {
  if (!Array.isArray(affiliationInfo) || affiliationInfo.length === 0) {
    return '';
  }
  return affiliationInfo
    .map((info) => info?.author_name)
    .filter(Boolean)
    .join(', ');
};
