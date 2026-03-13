import type { ActionItem } from '@components/common/CrTable/types.ts';

// Base interface for records that support table actions
export interface TableActionRecord {
    oai?: string;  // Made optional to support Duplicates
    articleId?: string;  // For Das/Rrs data
    coreId?: string;     // For Orcid data
    documentId?: string; // For Duplicates data
}

// Generic function to create standard table actions
export function CrTableActions<T extends TableActionRecord>(): ActionItem<T>[] {
    return [
        {
            key: 'core',
            label: 'Open in CORE',
            onClick: (record: T) => {
                // Check all possible ID fields
                const id = record.articleId || record.coreId || record.documentId;
                if (id) {
                    window.open(`https://core.ac.uk/outputs/${id}`, '_blank');
                }
            },
        },
        {
            key: 'repo',
            label: 'Open in the repository',
            onClick: (record: T) => {
                const idpUrl = import.meta.env.VITE_IDP_URL;
                if (record.oai && idpUrl) {
                    window.open(`${idpUrl}/oai/${record.oai}`, '_blank');
                }
            },
        },
    ];
}
