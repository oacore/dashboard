export interface ValidationResult {
  missingRequiredData?: Record<string, string[]>;
  missingOptionalData?: Record<string, string[]>;
  parseFailed?: boolean;
  reportDate?: string;
  rioxxVersion?: string;
}

export interface ValidationItem {
  title?: string;
  description?: string;
  resolution?: string;
  severity?: string;
  key: string;
  outputsCount?: number;
  elementName?: string;
  messages?: string | string[];
}

export interface RioxValidatorProps {
  handleValidateClick: () => void;
  validationResult: ValidationResult;
  handleTextareaChange: (value: string) => void;
  recordValue: string;
  filteredIssue: ValidationItem[];
  filteredWarning: ValidationItem[];
  isValidating?: boolean;
  error?: string | null;
}

export interface ValidateCardProps {
  handleValidateClick: () => void;
  handleTextareaChange: (value: string) => void;
  recordValue: string;
  validationResult?: ValidationResult;
}

export interface IssueCardProps {
  validationList: ValidationItem[];
  issueCount?: boolean;
  filteredWarning?: boolean;
  filteredIssue?: boolean;
  filterRepositoryIssueData?: boolean;
}

export interface MissingTerm {
  elementName: string;
  outputsCount: number;
}

export interface RioxxStats {
  partiallyCompliantCount: number;
  compliantCount: number;
  totalCount: number;
  missingTermsBasic?: MissingTerm[];
  [key: string]: unknown;
}
