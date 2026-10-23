import type { FreshFindsSettingsFormValues } from '../types/settings.types';

const hasText = (value: string | null | undefined) => (value ?? '').trim() !== '';

const hasSelectedSource = (values: FreshFindsSettingsFormValues) =>
  Object.values(values.sources).some(Boolean);

export const areFreshFindsSettingsComplete = (
  values: FreshFindsSettingsFormValues | null,
  passwordConfigured: boolean,
): boolean => {
  if (!values || !hasSelectedSource(values)) {
    return false;
  }

  if (!hasText(values.repositoryProfile) || !hasText(values.integrationMode)) {
    return false;
  }

  if (values.integrationMode !== 'push') {
    return true;
  }

  const hasPassword = passwordConfigured || hasText(values.swordPassword);

  return (
    hasText(values.depositFrequency)
    && values.maximumPapersPerDeposit != null
    && values.maximumPapersPerDeposit >= 1
    && hasText(values.swordUsername)
    && hasPassword
    && hasText(values.swordEndpointUrl)
  );
};
