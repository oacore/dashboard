import bronzeBadge from '@/assets/img/bronzeBadge.svg';
import goldBadge from '@/assets/img/goldBadge.svg';
import silverBadge from '@/assets/img/silverBadge.svg';
import type { FairCertificationLevel } from '@features/Fair/types/fairCertification.types';
import { downloadFile } from '@/utils/downloadUtils';

const BADGE_BY_LEVEL: Record<string, string> = {
  bronze: bronzeBadge,
  silver: silverBadge,
  gold: goldBadge,
  platinum: goldBadge,
};

const getBadgeUrl = (level?: FairCertificationLevel | null): string =>
  BADGE_BY_LEVEL[level?.toLowerCase() ?? ''] ?? bronzeBadge;

export const buildFairCertificateBadgeFilename = (repositoryName?: string | null): string => {
  const repositoryPart = (repositoryName ?? 'repository')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'repository';

  return `fair-certification-badge-${repositoryPart}.svg`;
};

export const downloadFairCertificateBadge = (
  level?: FairCertificationLevel | null,
  repositoryName?: string | null,
): void => {
  downloadFile(getBadgeUrl(level), buildFairCertificateBadgeFilename(repositoryName));
};
