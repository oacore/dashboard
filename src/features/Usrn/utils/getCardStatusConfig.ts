import type { SupportStatusVariant, UsrnData } from '@features/Usrn/types/data.types';

type CardStatusConfig = {
  status: SupportStatusVariant;
  countCovered: number | null;
  countTotal: number | null;
  countValue: number | null;
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
};

export const getCardStatusConfig = ({
  cardId,
  rioxx,
  statistics,
  internalStatistics,
  usrn,
  irus,
  rorId,
}: GetCardStatusConfigParams): CardStatusConfig => {
  const empty: CardStatusConfig = {
    status: 'no',
    countCovered: null,
    countTotal: null,
    countValue: null,
  };

  const hasValue = (n: number | null): SupportStatusVariant => (n ? 'yes' : 'no');

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
    case 'webAccessibility':
    case 'supportSignpostingFAIR':
    case 'metadataCOAR':
    case 'ORCID':
      return empty;
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
