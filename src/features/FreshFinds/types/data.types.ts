/** Institution block under each author (API may send one object or an array). */
export interface FreshFindsAffiliationBlock {
    name?: string[];
    ror_id?: string[];
}

export interface FreshFindsAffiliationInfo {
    author_name?: string;
    affiliation?: FreshFindsAffiliationBlock | FreshFindsAffiliationBlock[];
}

/**
 * Row from `/fresh-finds`: DOI + affiliation_info (authors and nested affiliations).
 */
export type FreshFindsRecord = {
    DOI?: string;
    affiliation_info?: FreshFindsAffiliationInfo[];
    status?: string;
} & Record<string, unknown>;
