export interface DuplicateItem {
    type?: string;
    [key: string]: unknown;
}

export interface DuplicateData {
    articleId: string;
    workId: number;
    oai: string;
    title: string;
    publicationDate: string;
    authors: string[];
    count: number;
    duplicates: DuplicateItem[];
    [key: string]: unknown;
}

export interface DuplicatesResponse {
    count: number;
    duplicateList: Record<string, DuplicateData>;
}

export interface DuplicatesStats {
    total: number;
    [key: string]: unknown;
}

export interface DeduplicationDetailsItem {
    type?: string;
    [key: string]: unknown;
}
