import type { ArticleAdditionalData } from '@/hooks/useArticleData';

import type { FreshFindsAffiliationInfo, FreshFindsRecord } from '../types/data.types';

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

export const filterFreshFindsRecords = (
  records: FreshFindsRecord[],
  searchTerm: string,
): FreshFindsRecord[] => {
  const needle = searchTerm.trim().toLowerCase();
  if (needle === '') {
    return records;
  }

  return records.filter((item) => {
    const authors = formatFreshFindsAuthors(item.affiliation_info).toLowerCase();
    const doi = item.DOI != null ? String(item.DOI).toLowerCase() : '';
    return authors.includes(needle) || doi.includes(needle);
  });
};

const stripDoiOrgPrefix = (doi: string): string =>
  doi.trim().replace(/^\s*https?:\/\/doi\.org\//i, '');

export const buildFreshFindsDoiHref = (doi: string): string => {
  const slug = stripDoiOrgPrefix(doi);
  if (slug === '') {
    return '';
  }
  return `https://doi.org/${encodeURIComponent(slug)}`;
};

export const buildFreshFindsOutputsUrl = (doi: string | undefined): string => {
  const trimmed = doi?.trim() ?? '';
  if (trimmed === '') {
    return 'https://core.ac.uk/';
  }
  const href = buildFreshFindsDoiHref(trimmed);
  return href !== '' ? href : 'https://core.ac.uk/';
};

export const mapFreshFindsRecordToArticle = (
  record: FreshFindsRecord,
): ArticleAdditionalData => {
  const doiRaw = record.DOI != null ? String(record.DOI).trim() : '';
  const authorKey = formatFreshFindsAuthors(record.affiliation_info).slice(0, 120);
  const idBase =
    doiRaw !== '' ? doiRaw : authorKey !== '' ? authorKey : 'fresh-finds-row';
  return {
    id: `fresh-finds-${idBase}`,
    title: doiRaw !== '' ? `Fresh find · ${doiRaw}` : 'Fresh find',
    doi: doiRaw !== '' ? doiRaw : undefined,
    authors: Array.isArray(record.affiliation_info)
      ? record.affiliation_info.map((a) => ({
          name: String(a.author_name ?? '').trim() || '—',
        }))
      : undefined,
  };
};
