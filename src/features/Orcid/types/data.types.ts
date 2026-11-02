export interface Author {
    name: string;
    // Add other author properties as needed
}

export interface OrcidData {
    oai: string;
    title: string;
    publicationDate: string;
    authors: Author[];
    author_pid: string[];
    coreId: string;
}

export interface OrcidStats {
    basic: number;
    fromOtherRepositories: number;
}

/** Returned by ORCID endpoints while the repository result is still being built. */
export interface OrcidProcessingResponse {
    endpoint: string;
    repositoryId: number;
    status: 'processing';
}
