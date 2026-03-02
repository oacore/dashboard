export interface DataProviderStatistics {
    countFulltext: number;
    countMetadata: number;
    history: Record<string, number>;
    id: number;
    lastSeen: {
        isActive: boolean;
        harvest_times: unknown[];
    };
    set: string;
    sourceStats: unknown[];
}

export interface DoiStatistics {
    dataProviderDoiCount?: number;
    totalDoiCount?: number;
    [key: string]: unknown;
}

