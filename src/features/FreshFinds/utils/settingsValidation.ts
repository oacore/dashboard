import type {
  FreshFindsSettingsFormValues,
  FreshFindsSettingsSources,
} from '../types/settings.types';

export type FreshFindsRequiredField =
  | 'sources'
  | 'repositoryProfile'
  | 'integrationMode'
  | 'depositFrequency'
  | 'maximumPapersPerDeposit'
  | 'swordUsername'
  | 'swordPassword'
  | 'swordEndpointUrl';

const LEFT_FIELDS: FreshFindsRequiredField[] = [
  'sources',
  'repositoryProfile',
  'integrationMode',
];

const PUSH_FIELDS: FreshFindsRequiredField[] = [
  'depositFrequency',
  'maximumPapersPerDeposit',
  'swordUsername',
  'swordPassword',
  'swordEndpointUrl',
];

const hasText = (value: string | null | undefined): boolean =>
  (value ?? '').trim() !== '';

export const hasSelectedSource = (
  sources: FreshFindsSettingsSources | null | undefined,
): boolean => {
  if (!sources) {
    return false;
  }

  return Object.values(sources).some(Boolean);
};

export const getIncompleteSettingsFields = (
  values: FreshFindsSettingsFormValues | null,
  passwordConfigured: boolean,
): FreshFindsRequiredField[] => {
  if (!values) {
    return [...LEFT_FIELDS, ...PUSH_FIELDS];
  }

  const missing: FreshFindsRequiredField[] = [];

  if (!hasSelectedSource(values.sources)) {
    missing.push('sources');
  }

  if (!hasText(values.repositoryProfile)) {
    missing.push('repositoryProfile');
  }

  if (!hasText(values.integrationMode)) {
    missing.push('integrationMode');
  }

  if (values.integrationMode !== 'push') {
    return missing;
  }

  if (!hasText(values.depositFrequency)) {
    missing.push('depositFrequency');
  }

  if (values.maximumPapersPerDeposit == null || values.maximumPapersPerDeposit < 1) {
    missing.push('maximumPapersPerDeposit');
  }

  if (!hasText(values.swordUsername)) {
    missing.push('swordUsername');
  }

  if (!passwordConfigured && !hasText(values.swordPassword)) {
    missing.push('swordPassword');
  }

  if (!hasText(values.swordEndpointUrl)) {
    missing.push('swordEndpointUrl');
  }

  return missing;
};

export const areFreshFindsSettingsComplete = (
  values: FreshFindsSettingsFormValues | null,
  passwordConfigured: boolean,
): boolean => getIncompleteSettingsFields(values, passwordConfigured).length === 0;
