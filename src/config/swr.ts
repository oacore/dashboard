/* eslint-disable */
// @typescript-eslint/no-explicit-any
import type { SWRConfiguration } from 'swr'
import { captureHandledError } from '@/utils/captureHandledError'
import { http } from './axios'

export const fetcher = async (url: string, withCredentials: boolean = true) => {
  const response = await http.get(url, { withCredentials })
  return response.data

}

export const postRequestFetcher = async (
  url: string,
  data?: any,
  withCredentials: boolean = true,
  config?: { headers?: Record<string, string> }
) => {
  const response = await http.post(url, data, {
    withCredentials,
    ...(config?.headers && { headers: config.headers })
  })
  return response.data
}

export const patchRequest = async (
  url: string,
  data?: any,
  withCredentials: boolean = true
) => {
  const response = await http.patch(url, data, { withCredentials })
  return response.data
}

export const putRequest = async (
  url: string,
  data?: any,
  withCredentials: boolean = true
) => {
  const response = await http.put(url, data, { withCredentials })
  return response.data
}

export const deleteRequest = async (
  url: string,
  withCredentials: boolean = true
) => {
  const response = await http.delete(url, { withCredentials })
  return response.data
}


// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  // Default fetcher for all SWR hooks
  fetcher,

  // Revalidation settings
  revalidateOnFocus: true, // Revalidate when window gains focus
  revalidateOnReconnect: true, // Revalidate when network reconnects
  revalidateIfStale: true, // Revalidate if data is stale

  // Cache settings
  dedupingInterval: 10000, // Dedupe requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidation to 5 seconds

  // Retry configuration
  errorRetryCount: 0,
  errorRetryInterval: 5000, // Retry after 5 seconds

  // Cache provider
  provider: () => new Map(),

  // Global loading state
  keepPreviousData: true, // Keep previous data while loading new data

  // Suspense mode (optional)
  suspense: false,

  // Refresh interval (disabled by default, enable per hook if needed)
  refreshInterval: 0,

  // Refresh when hidden (disabled by default)
  refreshWhenHidden: false,

  // Refresh when offline (disabled by default)
  refreshWhenOffline: false,

  // Compare function for determining if data has changed
  compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
}

/**
 * Shared SWR config used by all API calls. Same options everywhere.
 *
 * - revalidateOnFocus: Refetch when window/tab gains focus
 * - revalidateIfStale: Refetch when component mounts and data is stale
 * - revalidateOnReconnect: Refetch when network reconnects
 * - dedupingInterval: ms to deduplicate identical requests
 * - shouldRetryOnError: Retry failed requests
 * - errorRetryCount: Number of retries when shouldRetryOnError is true
 */
export const swrDefaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 0,
  shouldRetryOnError: true,
  errorRetryCount: 1,
};

// Custom hooks for common patterns
export const createSWRKey = (endpoint: string, params?: Record<string, any>) => {
  if (!params) return endpoint
  const queryString = new URLSearchParams(params).toString()
  return `${endpoint}?${queryString}`
}

// Optimistic update helper
export const optimisticUpdate = <T>(
  mutate: any,
  key: string,
  newData: T,
) => {
  return mutate(key, newData, {
    rollbackOnError: true,
    populateCache: true,
    revalidate: true,
  })
}

// Mutation helper for common operations
export const createMutationHelpers = (mutate: any) => ({
  // Create operation
  create: async <T>(
    key: string,
    createFn: () => Promise<T>,
    newItem: T
  ) => {
    try {
      const result = await createFn()
      // Optimistically update the cache
      await mutate(key, (current: T[]) => [...(current || []), newItem], false)
      // Revalidate to get the actual server response
      await mutate(key)
      return result
    } catch (error) {
      captureHandledError(error, {
        tags: { feature: 'swr', action: 'mutation_create' },
        extra: { key },
      })
      // Rollback on error
      await mutate(key)
      throw error
    }
  },

  // Update operation
  update: async <T>(
    key: string,
    updateFn: () => Promise<T>,
    updatedItem: T,
    findFn?: (item: any) => boolean
  ) => {
    try {
      const result = await updateFn()
      // Optimistically update the cache
      await mutate(key, (current: T[]) => {
        if (!current) return current
        if (findFn) {
          return current.map(item => findFn(item) ? updatedItem : item)
        }
        return current
      }, false)
      // Revalidate to get the actual server response
      await mutate(key)
      return result
    } catch (error) {
      captureHandledError(error, {
        tags: { feature: 'swr', action: 'mutation_update' },
        extra: { key },
      })
      // Rollback on error
      await mutate(key)
      throw error
    }
  },

  // Delete operation
  delete: async (
    key: string,
    deleteFn: () => Promise<void>,
    findFn?: (item: any) => boolean
  ) => {
    try {
      await deleteFn()
      // Optimistically update the cache
      await mutate(key, (current: any[]) => {
        if (!current) return current
        if (findFn) {
          return current.filter(item => !findFn(item))
        }
        return current
      }, false)
      // Revalidate to get the actual server response
      await mutate(key)
    } catch (error) {
      captureHandledError(error, {
        tags: { feature: 'swr', action: 'mutation_delete' },
        extra: { key },
      })
      // Rollback on error
      await mutate(key)
      throw error
    }
  },
})
