import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { message } from 'antd';

import { fetcher, postRequestFetcher, swrDefaultConfig } from '@/config/swr';
import { captureHandledError } from '@/utils/captureHandledError';
import { useDataProviderStore } from '@/store/dataProviderStore';

import {
  FRESH_FINDS_SOURCE_KEYS,
  type FreshFindsSettingsFormValues,
  type FreshFindsSettingsResponse,
  type FreshFindsSettingsSources,
  type FreshFindsSettingsUpdatePayload,
} from '../types/settings.types';

const DEFAULT_MAX_PAPERS = 500;

export const mapFreshFindsSettingsToForm = (
  settings: FreshFindsSettingsResponse,
): FreshFindsSettingsFormValues => ({
  sources: FRESH_FINDS_SOURCE_KEYS.filter((sourceKey) => Boolean(settings.sources?.[sourceKey])),
  notifyByEmail: settings.notifyByEmail,
  fullTextOnly: settings.depositOnlyWithFullText,
  depositFrequency: settings.depositFrequency,
  autoDeposit: settings.autoDepositEnabled,
  maxPapersPerDeposit: settings.maximumPapersPerDeposit,
  username: settings.swordUsername ?? '',
  swordPassword: '',
  swordEndpointUrl: settings.swordEndpointUrl ?? '',
  repositoryProfile: settings.repositoryProfile ?? undefined,
});

export const mapFormToFreshFindsSettingsUpdate = (
  values: FreshFindsSettingsFormValues,
  current: FreshFindsSettingsResponse | null,
): FreshFindsSettingsUpdatePayload => {
  const password = values.swordPassword.trim();
  const sources = FRESH_FINDS_SOURCE_KEYS.reduce((selectedSources, sourceKey) => {
    selectedSources[sourceKey] = values.sources.includes(sourceKey);
    return selectedSources;
  }, {} as FreshFindsSettingsSources);

  return {
    integrationMode: current?.integrationMode ?? 'push',
    enabled: current?.enabled ?? true,
    repositoryProfile: values.repositoryProfile ?? current?.repositoryProfile ?? null,
    autoDepositEnabled: values.autoDeposit,
    swordUsername: values.username.trim(),
    swordPassword: password,
    swordEndpointUrl: values.swordEndpointUrl.trim(),
    swordServiceDocumentUrl: current?.swordServiceDocumentUrl ?? null,
    exportFormat: current?.exportFormat ?? 'json',
    sources,
    notifyByEmail: values.notifyByEmail,
    depositOnlyWithFullText: values.fullTextOnly,
    depositFrequency: values.depositFrequency,
    maximumPapersPerDeposit: values.maxPapersPerDeposit ?? DEFAULT_MAX_PAPERS,
  };
};

export const useFreshFindsSettings = () => {
  const { selectedDataProvider, isLoaded } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;

  const key = isLoaded && dataProviderId
    ? `/internal/data-providers/${dataProviderId}/fresh-finds/settings`
    : null;

  const [isSaving, setIsSaving] = useState(false);

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
      message.error('No data provider selected');
      return false;
    }

    setIsSaving(true);

    try {
      await postRequestFetcher(
        `/internal/data-providers/${dataProviderId}/fresh-finds/settings`,
        mapFormToFreshFindsSettingsUpdate(values, data ?? null),
      );

      try {
        await mutate();
      } catch (refreshError) {
        captureHandledError(refreshError, {
          tags: { feature: 'fresh-finds', action: 'refresh-settings' },
          extra: { dataProviderId },
        });
      }

      return true;
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
    settings: data ?? null,
    error,
    isLoading: !isLoaded || Boolean(key && isLoading),
    isSaving,
    saveSettings,
    mutate,
  };
};
