import useSWR from 'swr';
import { createSWRKey, fetcher, swrDefaultConfig } from '@config/swr.ts';
import { useEffect } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';

interface Location {
    idRepository: number;
    countryCode: string;
    longitude: string;
    latitude: string;
}

interface Repository {
    dashboardRepo: number;
    idRepository: number;
    idOpendoar: number | null;
    name: string;
}

interface RepositoryLocation {
    id: number;
    countryCode: string;
    longitude: string;
    latitude: string;
}

export interface RepositorySelectProps {
    dataProviders?: DataProvider[];
    isLoading?: boolean;
    selectedDataProvider?: DataProvider | null;
    onSelectChange?: (provider: DataProvider | null) => void;
    placeholder?: string;
    showSearch?: boolean;
}

interface RorData {
    coreId: number;
    rorId: string;
    rorName: string;
}

export interface DataProvider {
    coverPath: string | null;
    email: string;
    id: number;
    institution: string;
    isOaiActivated: boolean;
    location: Location;
    logoBase64: string;
    logoPath: string;
    name: string;
    oaiPmhBase: string;
    repository: Repository;
    repositoryLocation: RepositoryLocation;
    rorData: RorData;
    logo?: string;
}


export const useUserDataProviders = (userId: string | null) => {
    const key = userId ? createSWRKey(`/internal/users/${userId}/data-providers`) : null;
    const {
        selectedDataProvider,
        setSelectedDataProvider,
        setDataProviders,
        setLoading,
        setError,
        isLoaded
    } = useDataProviderStore();

    const { data, error, isLoading, mutate } = useSWR<DataProvider[]>(
        key,
        () => fetcher(key!).then(res => {

            return (res as DataProvider[]).map(provider => ({
                ...provider,
                logo: provider.logoBase64 || provider.logoPath || undefined
            }));
        }),
        swrDefaultConfig,
    );


    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Failed to load data providers');
        } else {
            setError(null);
        }
    }, [error, setError]);

    useEffect(() => {
        if (data == null) return;
        setDataProviders(data);
        if (data.length > 0 && !selectedDataProvider) {
            setSelectedDataProvider(data[0]);
        }
    }, [data, selectedDataProvider, setSelectedDataProvider, setDataProviders]);

    return {
        dataProviders: data || [],
        error,
        isLoading,
        mutate,
        isError: !!error,
        isEmpty: !isLoading && !error && (!data || data.length === 0),
        isLoaded,
    };
};
