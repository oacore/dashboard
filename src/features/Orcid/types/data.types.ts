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
