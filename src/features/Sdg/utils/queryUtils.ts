export const buildDateRangeQuery = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    return `yearPublished>=${startDate} AND yearPublished<=${endDate}`;
};
