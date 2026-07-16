export type FairCertificationStatus =
  | 'not_certified'
  | 'pending'
  | 'certified'
  | 'expired'
  | string;

export type FairCertificationLevel =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | string;

export type FairCertificationQuestionResultStatus = 'pass' | 'fail' | 'unknown' | string;

export type FairCertificationQuestionCounts = Record<string, number | undefined>;

export type FairCertificationQuestionMetrics = Record<string, number | undefined>;

export type FairCertificationQuestionResult = {
  status?: FairCertificationQuestionResultStatus;
  metrics?: FairCertificationQuestionMetrics;
  counts?: FairCertificationQuestionCounts;
  evidence?: Record<string, unknown>;
  threshold?: {
    operator?: string;
    value?: number;
    unit?: string;
  };
  source?: string;
  checkedAt?: string;
};

export type FairCertificationQuestion = {
  id: string;
  number?: string;
  section?: string;
  type?: string;
  required?: boolean;
  question?: string;
  description?: string;
  recommendation?: string;
  answer?: string;
  result?: FairCertificationQuestionResult;
};

export type FairCertificationApiResponse = {
  status?: FairCertificationStatus;
  level?: FairCertificationLevel | null;
  repositoryName?: string;
  issueDate?: string | null;
  validUntil?: string | null;
  lastReportUpdate?: string | null;
  submissionCount?: number | null;
  questions?: FairCertificationQuestion[];
  [key: string]: unknown;
};
