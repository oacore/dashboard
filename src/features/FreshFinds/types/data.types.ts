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
  deposit: unknown | null;
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
