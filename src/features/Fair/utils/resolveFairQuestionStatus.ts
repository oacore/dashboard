import type { DasData } from '@features/Das/types/data.types';
import type { OrcidStats } from '@features/Orcid/types/data.types';
import type { UsrnData } from '@features/Usrn/types/data.types';
import { getCardStatusConfig } from '@features/Usrn/utils/getCardStatusConfig';
import type { FairQuestionItem } from '@features/Fair/types/fairPrinciples.types';

/** Same shape as data passed to USRN `getCardStatusConfig` / `UsrnView` `configParams`. */
export type FairRepositoryStatusParams = {
  rioxx: { partiallyCompliantCount?: number; totalCount?: number } | undefined;
  statistics: { countMetadata?: number } | undefined;
  internalStatistics: {
    fullTextCount?: number;
    metadataCount?: number;
    doiCount?: number;
  } | undefined;
  usrn: UsrnData | null;
  irus: unknown;
  rorId: string | null;
  orcidStats?: OrcidStats | null;
  dasData?: DasData[] | null;
};

/** Maps FAIR question `id` (from `fair.json`) to USRN card ids used by `getCardStatusConfig`. */
const mapFairQuestionIdToUsrnCardId = (fairId: string): string | null => {
  const byId: Record<string, string> = {
    '': 'indexedContent',
    r11: 'oaiPmh',
    r12: 'applicationProfile',
    r21: 'accessFullTexts',
    r22: 'embargoedDocuments',
    r23: 'licensing',
    r31: 'supportSignpostingFAIR',
    r32: 'metadataCOAR',
    r35: 'DOI',
    r36: 'ORCID',
    r37: 'ROR',
    r41: 'webAccessibility',
    r42: 'sourceCode',
  };
  return byId[fairId] ?? null;
};

const capitalizeStatus = (status: 'yes' | 'no'): 'Yes' | 'No' =>
  status === 'yes' ? 'Yes' : 'No';

export type ResolveFairQuestionStatusLabelParams = {
  item: FairQuestionItem;
  repositoryStatus: FairRepositoryStatusParams | null | undefined;
  openQuestionLabel: string;
};

export type FairQuestionResolvedDisplay = {
  statusLabel: string | null;
  cardConfig: ReturnType<typeof getCardStatusConfig> | null;
};

/**
 * Resolves status label (chip) and USRN card metrics for a FAIR row in one `getCardStatusConfig` call.
 */
export const resolveFairQuestionDisplay = ({
  item,
  repositoryStatus,
  openQuestionLabel,
}: ResolveFairQuestionStatusLabelParams): FairQuestionResolvedDisplay => {
  if (item.openQuestion) {
    return { statusLabel: openQuestionLabel, cardConfig: null };
  }

  if (!repositoryStatus) {
    return { statusLabel: null, cardConfig: null };
  }

  const cardId = mapFairQuestionIdToUsrnCardId(item.id);
  if (!cardId) {
    return { statusLabel: null, cardConfig: null };
  }

  const cardConfig = getCardStatusConfig({
    cardId,
    rioxx: repositoryStatus.rioxx,
    statistics: repositoryStatus.statistics,
    internalStatistics: repositoryStatus.internalStatistics,
    usrn: repositoryStatus.usrn,
    irus: repositoryStatus.irus,
    rorId: repositoryStatus.rorId,
    orcidStats: repositoryStatus.orcidStats ?? null,
    dasData: repositoryStatus.dasData ?? null,
  });

  if (cardConfig.status === 'yes' || cardConfig.status === 'no') {
    return { statusLabel: capitalizeStatus(cardConfig.status), cardConfig };
  }

  return { statusLabel: null, cardConfig };
};

/**
 * Resolves the status chip for a FAIR principle row: open-question badge, Yes/No from
 * `getCardStatusConfig` when the question maps to a USRN card, or `null` when there is no API match
 * (caller should show an em dash).
 */
export const resolveFairQuestionStatusLabel = (
  params: ResolveFairQuestionStatusLabelParams,
): string | null => resolveFairQuestionDisplay(params).statusLabel;
