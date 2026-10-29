import type { OrcidProcessingResponse, OrcidStats } from '@features/Orcid/types/data.types';

export const EMPTY_ORCID_STATS: OrcidStats = {
    basic: 0,
    fromOtherRepositories: 0,
};

export const isOrcidProcessingResponse = (
    value: unknown,
): value is OrcidProcessingResponse => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return (value as { status?: unknown }).status === 'processing';
};

export const isOrcidStats = (value: unknown): value is OrcidStats => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const stats = value as OrcidStats;
    return typeof stats.basic === 'number' && typeof stats.fromOtherRepositories === 'number';
};
