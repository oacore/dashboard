import type {
    FreshFindsAffiliationBlock,
    FreshFindsAffiliationInfo,
    FreshFindsRecord,
} from '../types/data.types';

const blocksFromAffiliation = (
    affiliation: FreshFindsAffiliationBlock | FreshFindsAffiliationBlock[] | undefined,
): FreshFindsAffiliationBlock[] => {
    if (affiliation == null) {
        return [];
    }
    return Array.isArray(affiliation) ? affiliation : [affiliation];
};

const collectNamesFromBlock = (block: FreshFindsAffiliationBlock, into: Set<string>) => {
    const nameList = block.name;
    if (!Array.isArray(nameList)) {
        return;
    }
    for (const n of nameList) {
        const trimmed = String(n).trim();
        if (trimmed !== '') {
            into.add(trimmed);
        }
    }
};

/** Unique institution names across all authors on the record (for table + search). */
export const formatFreshFindsAffiliationNames = (record: FreshFindsRecord): string => {
    const infos = record.affiliation_info;
    if (!Array.isArray(infos) || infos.length === 0) {
        return '';
    }
    const names = new Set<string>();
    for (const info of infos) {
        for (const block of blocksFromAffiliation(info?.affiliation)) {
            collectNamesFromBlock(block, names);
        }
    }
    return [...names].join('; ');
};

/** Readable affiliation line for one author (names + ROR ids when present). */
export const formatAuthorAffiliationSummary = (info: FreshFindsAffiliationInfo): string => {
    const parts: string[] = [];
    for (const block of blocksFromAffiliation(info.affiliation)) {
        const nameStr =
            Array.isArray(block.name) && block.name.length > 0
                ? block.name.map((n) => String(n).trim()).filter(Boolean).join(', ')
                : '';
        const rorStr =
            Array.isArray(block.ror_id) && block.ror_id.length > 0
                ? block.ror_id.map((r) => String(r).trim()).filter(Boolean).join(', ')
                : '';
        if (nameStr !== '' && rorStr !== '') {
            parts.push(`${nameStr} (${rorStr})`);
        } else if (nameStr !== '') {
            parts.push(nameStr);
        } else if (rorStr !== '') {
            parts.push(rorStr);
        }
    }
    return parts.join(' · ');
};
