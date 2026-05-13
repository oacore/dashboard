import type { FreshFindsRecord } from '../types/data.types';

import { formatFreshFindsAuthors } from './freshFindsAuthors';

export const filterFreshFindsRecords = (
  records: FreshFindsRecord[],
  searchTerm: string,
): FreshFindsRecord[] => {
  const lowerSearchTerm = searchTerm.trim().toLowerCase();
  if (lowerSearchTerm === '') {
    return records;
  }

  return records.filter((item) => {
    const authors = formatFreshFindsAuthors(item.affiliation_info).toLowerCase();
    const doi = item.DOI != null ? String(item.DOI).toLowerCase() : '';
    return authors.includes(lowerSearchTerm) || doi.includes(lowerSearchTerm);
  });
};
