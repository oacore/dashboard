import useSWR from 'swr'
import { createSWRKey, fetcher, swrDefaultConfig } from '@config/swr.ts'
import type { SdgYearDataResponse, SdgYearDataParams } from '../types/sdg.types'
import { useSdgTableStore } from '../store/sdgStore'
import { buildDateRangeQuery } from '../utils/queryUtils'

export const useSdgYearData = ({
  dataProviderId,
}: SdgYearDataParams) => {
  const { dateRange } = useSdgTableStore()

  // Build the URL with query parameters
  const buildUrl = () => {
    if (!dataProviderId) return null

    const baseUrl = `internal/data-providers/${dataProviderId}/sdg/aggregations`

    const dateQuery = buildDateRangeQuery(dateRange.startDate, dateRange.endDate)
    if (dateQuery) {
      const params = {
        q: `AND(${dateQuery})`
      }
      return createSWRKey(baseUrl, params)
    }

    return baseUrl
  }

  const key = buildUrl()

  const { data, error, isLoading, isValidating, mutate } = useSWR<SdgYearDataResponse>(
    key,
    key ? () => fetcher(key).then(res => res as SdgYearDataResponse) : null,
    {
      ...swrDefaultConfig,
      keepPreviousData: true,
    }
  )

  return {
    sdgYearData: data,
    sdgYearDataLoading: isLoading,
    sdgYearDataValidating: isValidating,
    sdgYearDataError: error,
    mutateSdgYearData: mutate,
    isError: !!error,
    isEmpty: !isLoading && !error && !data,
  }
}
