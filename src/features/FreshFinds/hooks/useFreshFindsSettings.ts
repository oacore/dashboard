import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { fetcher, postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';

import type {
  FreshFindsSettingsFormValues,
  FreshFindsSettingsResponse,
  FreshFindsSettingsUpdatePayload,
} from '../types/settings.types';

const DEFAULT_MAX_PAPERS = 500;

const toFormValues = (settings: FreshFindsSettingsResponse): FreshFindsSettingsFormValues => ({
  sources: settings.sources,
  notifyByEmail: settings.notifyByEmail,
  depositOnlyWithFullText: settings.depositOnlyWithFullText,
  depositFrequency: settings.depositFrequency,
  autoDepositEnabled: settings.autoDepositEnabled,
  maximumPapersPerDeposit: settings.maximumPapersPerDeposit,
  swordUsername: settings.swordUsername ?? '',
  swordPassword: '',
  swordEndpointUrl: settings.swordEndpointUrl ?? '',
  repositoryProfile: settings.repositoryProfile ?? undefined,
});

const toUpdatePayload = (
  values: FreshFindsSettingsFormValues,
  current: FreshFindsSettingsResponse | null,
): FreshFindsSettingsUpdatePayload => ({
  integrationMode: current?.integrationMode ?? 'push',
  enabled: current?.enabled ?? true,
  repositoryProfile: values.repositoryProfile ?? current?.repositoryProfile ?? null,
  autoDepositEnabled: values.autoDepositEnabled,
  swordUsername: values.swordUsername.trim(),
  swordPassword: values.swordPassword.trim(),
  swordEndpointUrl: values.swordEndpointUrl.trim(),
  swordServiceDocumentUrl: current?.swordServiceDocumentUrl ?? null,
  exportFormat: current?.exportFormat ?? 'json',
  sources: values.sources,
  notifyByEmail: values.notifyByEmail,
  depositOnlyWithFullText: values.depositOnlyWithFullText,
  depositFrequency: values.depositFrequency,
  maximumPapersPerDeposit: values.maximumPapersPerDeposit ?? DEFAULT_MAX_PAPERS,
});

export const useFreshFindsSettings = () => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const [isSaving, setIsSaving] = useState(false);

  const key = isLoaded && dataProviderId
    ? `/internal/data-providers/${dataProviderId}/fresh-finds/settings`
    : null;

  const { data, error, isLoading, mutate } = useSWR<FreshFindsSettingsResponse>(
    key,
    key ? () => fetcher(key).then((response) => response as FreshFindsSettingsResponse) : null,
    {
      ...swrDefaultConfig,
      onError: (err) => {
        captureHandledError(err, {
          tags: { feature: 'fresh-finds', action: 'fetch-settings' },
          extra: { dataProviderId },
        });
      },
    },
  );

  const saveSettings = useCallback(async (values: FreshFindsSettingsFormValues) => {
    if (!dataProviderId) {
      throw new Error('No data provider selected');
    }

    setIsSaving(true);

    try {
      await postRequestFetcher(
        `/internal/data-providers/${dataProviderId}/fresh-finds/settings`,
        toUpdatePayload(values, data ?? null),
      );
      await mutate();
    } catch (err) {
      captureHandledError(err, {
        tags: { feature: 'fresh-finds', action: 'save-settings' },
        extra: { dataProviderId },
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [data, dataProviderId, mutate]);

  return {
    formValues: data ? toFormValues(data) : null,
    passwordConfigured: Boolean(data?.swordPasswordConfigured),
    error,
    isLoading: !isLoaded || isLoading,
    isSaving,
    saveSettings,
  };
};
