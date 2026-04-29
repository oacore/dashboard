import type { DasData } from '@features/Das/types/data.types';
import type { OrcidStats } from '@features/Orcid/types/data.types';
import type { SupportStatusVariant, UsrnData } from '@features/Usrn/types/data.types';

export type CardCounterRow = {
  label: string;
  value: number;
};

type CardStatusConfig = {
  status: SupportStatusVariant;
  countCovered: number | null;
  countTotal: number | null;
  countValue: number | null;
  /** Multiple labelled counts (e.g. ORCID in repository vs in CORE). */
  counterRows?: CardCounterRow[];
};

const toNumber = (value: unknown): number | null => {
  if (value == null) return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

type GetCardStatusConfigParams = {
  cardId: string;
  rioxx: { partiallyCompliantCount?: number; totalCount?: number } | undefined;
  statistics: { countMetadata?: number } | undefined;
  internalStatistics: { fullTextCount?: number; metadataCount?: number; doiCount?: number } | undefined;
  usrn: UsrnData | null;
  irus: unknown;
  rorId: string | null;
  /** From `GET /internal/data-providers/:id/orcid/stats` (`useOrcidStats`). */
  orcidStats?: OrcidStats | null;
  /** From `GET .../data-access` (`useDasData`). Used for `webAccessibility` (DAS). */
  dasData?: DasData[] | null;
};

const ORCID_COUNTER_REPOSITORY_LABEL =
  'Papers with at least one ORCID in your repository:';
const ORCID_COUNTER_CORE_LABEL = 'Papers with at least one ORCID in CORE:';

export const getCardStatusConfig = ({
  cardId,
  rioxx,
  statistics,
  internalStatistics,
  usrn,
  irus,
  rorId,
  orcidStats,
  dasData,
}: GetCardStatusConfigParams): CardStatusConfig => {
  const empty: CardStatusConfig = {
    status: 'no',
    countCovered: null,
    countTotal: null,
    countValue: null,
  };

  const hasValue = (n: number | null): SupportStatusVariant => (n ? 'yes' : 'no');

  // TODO check for 1.3
  switch (cardId) {
    case 'oaiPmh':
      return { ...empty, status: 'yes' };
    case 'indexedContent': {
      const countValue = toNumber(statistics?.countMetadata);
      return {
        status: hasValue(countValue),
        countCovered: null,
        countTotal: null,
        countValue,
      };
    }
    // TODO check for 2.1
    case 'accessFullTexts': {
      const countCovered = toNumber(internalStatistics?.fullTextCount);
      const countTotal = toNumber(internalStatistics?.metadataCount);
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'applicationProfile': {
      const countCovered = rioxx?.partiallyCompliantCount ?? null;
      const countTotal = rioxx?.totalCount ?? null;
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'embargoedDocuments':
    case 'sourceCode':
      return empty;
    case 'webAccessibility': {
      const list = dasData ?? [];
      const countValue = list.length;
      return {
        ...empty,
        status: hasValue(countValue),
        countCovered: null,
        countTotal: null,
        countValue,
      };
    }
    case 'ORCID': {
      const basic = toNumber(orcidStats?.basic);
      const fromOther = toNumber(orcidStats?.fromOtherRepositories);
      const basicNum = basic ?? 0;
      const fromOtherNum = fromOther ?? 0;
      const totalInCore = basicNum + fromOtherNum;

      return {
        status: hasValue(basic),
        countCovered: null,
        countTotal: null,
        countValue: basic,
        counterRows: [
          { label: ORCID_COUNTER_REPOSITORY_LABEL, value: basicNum },
          { label: ORCID_COUNTER_CORE_LABEL, value: totalInCore },
        ],
      };
    }
    case 'supportSignpostingFAIR': {
      const countCovered = toNumber(usrn?.supportSignposting);
      const countTotal = toNumber(statistics?.countMetadata);
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'metadataCOAR': {
      const countCovered = toNumber(usrn?.vocabulariesCOAR);
      const countTotal = toNumber(statistics?.countMetadata);
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'licensing': {
      const countCovered = toNumber(usrn?.license);
      const countTotal = toNumber(statistics?.countMetadata);
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'IRUS':
      return { ...empty, status: irus ? 'yes' : 'no' };
    // TODO check for 3.5
    case 'DOI': {
      const countCovered = toNumber(internalStatistics?.doiCount);
      const countTotal = toNumber(statistics?.countMetadata);
      return {
        status: hasValue(countCovered),
        countCovered,
        countTotal,
        countValue: null,
      };
    }
    case 'ROR':
      return { ...empty, status: rorId ? 'yes' : 'no' };
    default:
      return empty;
  }
};
