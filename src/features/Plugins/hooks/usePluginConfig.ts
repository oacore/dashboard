import { useEffect } from 'react';
import useSWR from 'swr';
import { fetcher, swrDefaultConfig } from '@config/swr';
import { useDataProviderStore, type PluginsConfig } from '@/store/dataProviderStore';

interface PluginItem {
  type: 'discovery' | 'recommender';
  key?: string;
}

const toPluginsConfig = (items: PluginItem[]): PluginsConfig =>
  items.reduce<PluginsConfig>((config, item) => {
    if ((item.type === 'discovery' || item.type === 'recommender') && item.key) {
      config[item.type] = { key: String(item.key) };
    }
    return config;
  }, {});

const parsePluginsResponse = (res: unknown): PluginItem[] =>
  Array.isArray(res) ? res : [];

export const usePluginConfig = () => {
  const { selectedDataProvider, isLoaded, setPlugins } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const swrKey =
    isLoaded && dataProviderId
      ? `/internal/data-providers/${dataProviderId}/plugins`
      : null;

  const { data, mutate } = useSWR<PluginItem[]>(
    swrKey,
    swrKey ? () => fetcher(swrKey).then(parsePluginsResponse) : null,
    {
      ...swrDefaultConfig,
      onSuccess: (res) => setPlugins(toPluginsConfig(res ?? [])),
      onError: () => setPlugins({}),
    }
  );

  useEffect(() => {
    if (!dataProviderId) setPlugins({});
  }, [dataProviderId, setPlugins]);

  return { plugins: toPluginsConfig(data ?? []), mutate };
};
