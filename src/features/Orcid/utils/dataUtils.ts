import type { OrcidData } from '@features/Orcid/types/data.types';

export const filterAndSortOrcidData = (
    data: OrcidData[],
    searchTerm: string,
    sortField: string | null,
    sortOrder: 'asc' | 'desc' | null
): OrcidData[] => {
    let filteredData = data;

    // Apply search filter
    if (searchTerm.trim() !== '') {
        filteredData = data.filter(record =>
            record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.oai.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.authors.some(author =>
                author.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            record.author_pid.some(pid =>
                pid.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }

    // Apply sorting
    if (sortField && sortOrder) {
        filteredData = [...filteredData].sort((a, b) => {
            const aValue = a[sortField as keyof OrcidData];
            const bValue = b[sortField as keyof OrcidData];

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    return filteredData;
}; 