import type { ArticleAdditionalData } from '@/hooks/useArticleData';

import type { FreshFindsRecord } from '../types/data.types';

import { formatFreshFindsAuthors } from './freshFindsAuthors';

/** Maps API row shape into CrDrawer-compatible article fields (title used as headline when API has no paper title). */
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
