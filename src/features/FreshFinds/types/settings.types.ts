export const FRESH_FINDS_SOURCE_KEYS = [
  'coreNetworkRepositories',
  'institutionalRepositories',
  'journals',
  'preprintServers',
  'crossref',
] as const;

export type FreshFindsSourceKey = (typeof FRESH_FINDS_SOURCE_KEYS)[number];

export interface FreshFindsSettingsSources {
  coreNetworkRepositories: boolean;
  institutionalRepositories: boolean;
  journals: boolean;
  preprintServers: boolean;
  crossref: boolean;
}

export interface FreshFindsIntegrationMethodOption {
  value: string;
  label: string;
}

export interface FreshFindsSettingsResponse {
  repositoryId: number;
  configured: boolean;
  enabled: boolean;
  integrationMode: string;
  integrationMethodOptions: FreshFindsIntegrationMethodOption[];
  platform: string | null;
  sources: FreshFindsSettingsSources;
  autoDepositEnabled: boolean;
  swordUsername: string | null;
  swordPasswordConfigured: boolean;
  swordEndpointUrl: string | null;
  swordServiceDocumentUrl: string | null;
  repositoryProfile: string | null;
  exportFormat: string | null;
  notifyByEmail: boolean;
  depositOnlyWithFullText: boolean;
  depositFrequency: string;
  maximumPapersPerDeposit: number;
}

export interface FreshFindsSettingsUpdatePayload {
  integrationMode: string;
  enabled: boolean;
  repositoryProfile: string | null;
  autoDepositEnabled: boolean;
  swordUsername: string;
  swordPassword: string;
  swordEndpointUrl: string;
  swordServiceDocumentUrl: string | null;
  exportFormat: string | null;
  sources: FreshFindsSettingsSources;
  notifyByEmail: boolean;
  depositOnlyWithFullText: boolean;
  depositFrequency: string;
  maximumPapersPerDeposit: number;
}

export interface FreshFindsSettingsFormValues {
  sources: string[];
  notifyByEmail: boolean;
  fullTextOnly: boolean;
  depositFrequency: string;
  autoDeposit: boolean;
  maxPapersPerDeposit: number | null;
  username: string;
  swordPassword: string;
  swordEndpointUrl: string;
  repositoryProfile?: string;
}
