import useSWR from 'swr'
import { fetcher } from '@/config/swr'
import { useState, useCallback, useEffect } from 'react'
import { useDataProviderStore } from '@/store/dataProviderStore'
import { useSwStore } from '../store/swStore'
import type { SwResponse, SwRow, SwTab } from '../types/sw.types'

export interface SwTableDataParams {
    dataProviderId?: number | null
    from?: number
    size?: number
    searchTerm?: string
    tab?: SwTab
}

const pickRows = (resp: SwResponse | undefined, tab: SwTab): SwRow[] => {
    const g = resp?.groups
    if (!g) return []

    switch (tab) {
        case 'ready':
            return g.ready_for_validation ?? []

        case 'sent':
            return g.sent ?? []

        case 'responded':
            return g.responded ?? []

        case 'cancelled':
            return g.cancelled ?? []

        default:
            return []
    }
}

const useSwTableData = ({
    dataProviderId,
    from = 0,
    size = 50,
    searchTerm = '',
    tab = 'ready',
}: SwTableDataParams) => {
    const { selectedDataProvider, isLoaded } = useDataProviderStore()
    const { dateRange } = useSwStore()
    const effectiveDataProviderId = dataProviderId ?? selectedDataProvider?.id ?? null

    const [currentFrom, setCurrentFrom] = useState(from)
    const [allRows, setAllRows] = useState<SwRow[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [lastParams, setLastParams] = useState('')

    const buildUrl = useCallback(
        () => {
            if (!effectiveDataProviderId) return null

            const baseUrl = `/internal/data-providers/${effectiveDataProviderId}/sw-mentions`
            const params = new URLSearchParams()

            const startDate = dateRange.startDate
            const endDate = dateRange.endDate

            if (startDate && endDate) {
                params.append('fromDate', startDate)
                params.append('toDate', endDate)
            }

            if (searchTerm) {
                params.append('q', searchTerm)
            }

            const queryString = params.toString()
            return queryString ? `${baseUrl}?${queryString}` : baseUrl
        },
        [effectiveDataProviderId, searchTerm, dateRange.startDate, dateRange.endDate]
    )


    const paramsKey = JSON.stringify({
        dataProviderId: effectiveDataProviderId,
        size,
        searchTerm,
        tab,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    })

    useEffect(() => {
        if (paramsKey !== lastParams) {
            setCurrentFrom(0)
            setAllRows([])
            setLastParams(paramsKey)
            setIsLoadingMore(false)
        }
    }, [paramsKey, lastParams])

    const key = isLoaded && effectiveDataProviderId ? buildUrl() : null

    const { data, error, isLoading, mutate } = useSWR<SwResponse>(
        key,
        () => fetcher(key!).then((res) => res as SwResponse),
        {
            revalidateOnFocus: false,
            dedupingInterval: 0,
            onSuccess: (response) => {
                const incoming = pickRows(response, tab)
                if (incoming.length === 0) {
                    setIsLoadingMore(false)
                    return
                }

                setAllRows((prev) => (currentFrom === 0 ? incoming : [...prev, ...incoming]))
                setIsLoadingMore(false)
            },
            onError: () => setIsLoadingMore(false),
        }
    )

    const loadMore = useCallback(() => {
        if (isLoadingMore || isLoading) return
        setIsLoadingMore(true)
        setCurrentFrom(allRows.length)
    }, [allRows.length, isLoadingMore, isLoading])

    const lastBatchLen = pickRows(data, tab).length
    const isInitialLoad = currentFrom === 0 && allRows.length === 0

    return {
        rows: error ? [] : allRows,
        counts: data?.counts,
        urls: data?.swUrls,
        error,
        isLoading: isInitialLoad && (isLoading || !isLoaded),
        isLoadingMore: isLoadingMore && isLoading,
        mutate,
        loadMore,
        hasMore: !error && !!data && lastBatchLen === size,
        isInitialLoad,
    }
}

export default useSwTableData
