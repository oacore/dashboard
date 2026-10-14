export interface FreshFindsJournalIdentifier {
  type: string;
  id: string;
}

export interface FreshFindsJournal {
  id: number;
  title: string;
  publisher: string | null;
  identifiers: FreshFindsJournalIdentifier[];
}

export type FreshFindsRepositoryStatus =
  | 'added'
  | 'adding'
  | 'added_without_fulltext'
  | 'candidate'
  | 'fulltext_unavailable'
  | 'in_repository';

export type FreshFindsDepositOrigin = 'manual' | 'automatic';

export interface FreshFindsDeposit {
  origin?: FreshFindsDepositOrigin | null;
}

export type FreshFindsDepositFilter =
  | 'automatic'
  | 'manual'
  | 'available'
  | 'in_repository';

export interface FreshFindsWorkItem {
  workId: number;
  depositIdentifier: string;
  title: string;
  doi: string;
  documentType: string;
  language: string | null;
  publicationDate: string;
  authors: string[];
  authorDisplay: string;
  publisher: string;
  journals: FreshFindsJournal[];
  matchedInstitutionIds: number[];
  alreadyInRepository: boolean;
  status: FreshFindsRepositoryStatus;
  deposit: FreshFindsDeposit | null;
  canDeposit: boolean;
}

export interface FreshFindsPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FreshFindsIntegration {
  configured: boolean;
  enabled: boolean;
  autoDepositEnabled: boolean;
  platform: string | null;
  metadataProfile: string | null;
}

export interface FreshFindsWorksResponse {
  dataProviderId: number;
  institutionIds: number[];
  integration: FreshFindsIntegration;
  items: FreshFindsWorkItem[];
  pagination: FreshFindsPagination;
  warnings: string[];
}

/** Table row type for Fresh Finds works. */
export type FreshFindsRecord = FreshFindsWorkItem;

export interface FreshFindsDepositPayload {
  workId: number;
  confirm: boolean;
  includeFullText: number;
}
