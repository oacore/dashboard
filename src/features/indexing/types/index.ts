export interface HarvestingStatus {
    lastHarvestingDate?: string;
    lastHarvestingRequestDate?: string;
    scheduledState?: 'IN_DOWNLOAD_METADATA_QUEUE' | 'PENDING' | string;
    [key: string]: unknown;
}

export interface IssuesAggregation {
    countByType?: Record<string, number>;
    typesCount?: number;
    globalsCount?: number;
    [key: string]: unknown;
}

export interface IssueMessage {
    type: string;
    title?: string;
    severity?: string;
    description?: string;
    resolution?: string;
    trigger?: string;
    details?: string[];
    hidden?: boolean;
    matches?: string[];
}

export interface Issue {
    id: string;
    output?: {
        id: string;
        [key: string]: unknown;
    } | null;
    outputUrl?: string;
    [key: string]: unknown;
}

export interface IssueWithArticles {
    data: Issue[];
    size: number;
    isLastPageLoaded?: boolean;
    totalLength?: number | null;
    [key: string]: unknown;
}

