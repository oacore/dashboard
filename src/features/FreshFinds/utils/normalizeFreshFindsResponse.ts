import type { FreshFindsRecord } from '../types/data.types';

export const isFreshFindsDataRow = (item: unknown): item is FreshFindsRecord => {
    if (item == null || typeof item !== 'object' || Array.isArray(item)) {
        return false;
    }
    const row = item as FreshFindsRecord;
    const hasDoi = row.DOI != null && String(row.DOI).trim() !== '';
    const hasAuthors =
        Array.isArray(row.affiliation_info) && row.affiliation_info.length > 0;
    return hasDoi || hasAuthors;
};

/**
 * API may nest works under arbitrary keys (e.g. `{ "0": { "0": { DOI, affiliation_info }, "1": { ... }, "status": "..." }, "since": "..." }`).
 * Recursively collect leaf objects that look like a fresh-finds row.
 */
export const normalizeFreshFindsResponse = (raw: unknown): FreshFindsRecord[] => {
    const rows: FreshFindsRecord[] = [];

    const visit = (node: unknown) => {
        if (node == null) {
            return;
        }
        if (Array.isArray(node)) {
            for (const el of node) {
                visit(el);
            }
            return;
        }
        if (typeof node !== 'object') {
            return;
        }

        if (isFreshFindsDataRow(node)) {
            rows.push(node);
            return;
        }

        for (const value of Object.values(node as Record<string, unknown>)) {
            visit(value);
        }
    };

    visit(raw);
    return rows;
};
