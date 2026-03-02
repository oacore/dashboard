export interface DoiAuthor {
    name: string;
}

export interface DoiData {
    id: number;
    oai: string;
    other_document: number;
    crossrefDoi: string | null;
    repoDoi: string | null;
    publicationDate: string;
    title: string;
    authors: DoiAuthor[];
    [key: string]: unknown;
}

export interface DoiResponse {
    count: number;
    duplicateList: Record<string, DoiData>;
}