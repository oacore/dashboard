export type FairCertificationWorkflowStatus = string;

export type FairCertificationCertificateStatus =
  | 'valid'
  | 'expired'
  | 'not_certified'
  | string;

export type FairCertificationLevel =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | string;

export type FairCertificationQuestionResultStatus = 'pass' | 'fail' | 'unknown' | string;

export type FairCertificationQuestionType = 'open' | 'automatic' | string;

export type FairCertificationQuestionCountEntry = {
  name: string;
  value: number | null;
};

export type FairCertificationQuestionCounts =
  | Record<string, number | null | undefined>
  | FairCertificationQuestionCountEntry[];

export type FairCertificationQuestionMetricEntry = {
  name: string;
  value: number | null;
  unit?: string;
};

export type FairCertificationQuestionMetrics =
  | Record<string, number | null | undefined>
  | FairCertificationQuestionMetricEntry[];

export type FairCertificationQuestionResult = {
  value?: boolean | string | number;
  status?: FairCertificationQuestionResultStatus;
  source?: string;
  checkedAt?: string;
  metrics?: FairCertificationQuestionMetrics;
  counts?: FairCertificationQuestionCounts;
  evidence?: Record<string, unknown>;
  threshold?: {
    operator?: string;
    value?: number;
    unit?: string;
  };
};

export type FairCertificationQuestionAnswer = {
  answer?: string;
  editedAt?: string;
  editedBy?: string;
  editedDate?: string;
};

export type FairCertificationQuestion = {
  id: string;
  number: string;
  section: string;
  type: FairCertificationQuestionType;
  required: boolean;
  question: string;
  description: string;
  recommendation: string;
  answer?: FairCertificationQuestionAnswer;
  result?: FairCertificationQuestionResult;
};

export type FairCertificationRepository = {
  repositoryId: number | string;
  repositoryName: string;
  organisationName: string;
  countryCode: string;
};

export type FairCertificationSubmissionReviewStatus = 'pending' | 'approved' | string;

export type FairCertificationSubmission = {
  id: number;
  submissionNumber: number;
  submittedBy: string;
  submittedAt: string;
  submissionDate: string;
  pdfGeneratedAt: string;
  reportUrl: string;
  reviewStatus: FairCertificationSubmissionReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
};

export type FairCertificationSubmissionsApiResponse = {
  submissions: FairCertificationSubmission[];
};

export type FairCertificationApiCertificate = {
  repositoryId: number;
  repositoryName: string;
  organisationName: string;
  countryCode: string;
  certificateId: string;
  level: FairCertificationLevel;
  issueDate: string;
  validUntil: string;
  status: FairCertificationCertificateStatus;
  certificateUrl: string;
  reportUrl: string;
  reviewedBy: string;
  reviewedAt: string;
};

export type FairCertificationApiResponse = {
  repositoryId: number;
  repository: FairCertificationRepository;
  workflowStatus: FairCertificationWorkflowStatus;
  certificationLevel: FairCertificationLevel;
  questionSetVersion: string;
  lastAssessmentAt: string;
  numberOfSubmissions: number;
  questions: FairCertificationQuestion[];
  submissions: FairCertificationSubmission[];
  certificate: FairCertificationApiCertificate | null;
};
