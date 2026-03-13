import type { DataProvider } from '@hooks/useDataProviders.ts';
import { create } from "zustand";
import type {
    DataProviderStatistics,
    DoiStatistics,
} from '@features/Doi/types/statistics.types.ts';

export interface PluginConfig {
    key: string;
    [key: string]: unknown;
}

export interface PluginsConfig {
    discovery?: PluginConfig;
    recommender?: PluginConfig;
}

interface DataProviderState {
    selectedDataProvider: DataProvider | null;
    selectedSetSpec: string | null;
    dataProviders: DataProvider[];
    isLoading: boolean;
    isUpdating: boolean;
    isLoaded: boolean;
    error: string | null;
    statistics: DataProviderStatistics | null;
    doiStatistics: DoiStatistics | null;
    plugins: PluginsConfig;
}

interface DataProviderActions {
    setSelectedDataProvider: (dataProvider: DataProvider | null) => void;
    setSelectedSetSpec: (setSpec: string | null) => void;
    setDataProviders: (dataProviders: DataProvider[]) => void;
    addDataProvider: (dataProvider: DataProvider) => void;
    setLoading: (isLoading: boolean) => void;
    setUpdating: (isUpdating: boolean) => void;
    setError: (error: string | null) => void;
    setLoaded: (isLoaded: boolean) => void;
    setStatistics: (statistics: DataProviderStatistics | null) => void;
    setDoiStatistics: (doiStatistics: DoiStatistics | null) => void;
    setPlugins: (plugins: PluginsConfig) => void;
}

export const useDataProviderStore = create<DataProviderState & DataProviderActions>()((set) => ({
    selectedDataProvider: null,
    selectedSetSpec: null,
    dataProviders: [],
    isLoading: false,
    isUpdating: false,
    isLoaded: false,
    error: null,
    statistics: null,
    doiStatistics: null,
    plugins: {},

    setSelectedDataProvider: (dataProvider) => {
        set({ selectedDataProvider: dataProvider });
    },

    setSelectedSetSpec: (setSpec) => {
        set({ selectedSetSpec: setSpec });
    },

    setDataProviders: (dataProviders) => {
        set({ dataProviders, isLoaded: true, isLoading: false });
    },

    addDataProvider: (dataProvider) => {
        set((state) => {
            const exists = state.dataProviders.some((p) => p.id === dataProvider.id);
            if (exists) return {};
            return {
                dataProviders: [...state.dataProviders, dataProvider],
            };
        });
    },

    setLoading: (isLoading) => {
        set({ isLoading, error: null });
    },

    setUpdating: (isUpdating) => {
        set({ isUpdating });
    },

    setError: (error) => {
        set({ error, isLoading: false });
    },

    setLoaded: (isLoaded) => {
        set({ isLoaded });
    },

    setStatistics: (statistics) => {
        set({ statistics });
    },

    setDoiStatistics: (doiStatistics) => {
        set({ doiStatistics });
    },

    setPlugins: (plugins) => {
        set({ plugins });
    },
}));
