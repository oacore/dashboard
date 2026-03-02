import useSWR, { type SWRConfiguration } from 'swr'
import { createSWRKey, createMutationHelpers } from '@config/swr'

export function useSWRData<T = unknown>(
  key: string | null,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(key, config)

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    isError: !!error,
    isEmpty: !isLoading && !error && !data,
  }
}

// data with pagination
export function useSWRList<T = unknown>(
  endpoint: string,
  params?: Record<string, unknown>,
  config?: SWRConfiguration
) {
  const key = createSWRKey(endpoint, params)
  return useSWRData<T[]>(key, config)
}

// single item data
export function useSWRItem<T = unknown>(
  endpoint: string,
  id?: string | number,
  config?: SWRConfiguration
) {
  const key = id ? `${endpoint}/${id}` : null
  return useSWRData<T>(key, config)
}

// mutation helpers
export function useSWRWithMutations<T = unknown>(
  key: string | null,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(key, config)
  const mutations = createMutationHelpers(mutate)

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    mutations,
    isError: !!error,
    isEmpty: !isLoading && !error && !data,
  }
}

