import { useMemo, useState } from 'react';
import { AccessPlaceholder, CrPaper } from '@oacore/core-ui';

import { CrTable } from '@components/common/CrTable/CrTable.tsx';
import type { DrawerConfig } from '@components/common/CrTable/types.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

import { createColumns, getCustomSorters } from './FreshFindsColumns.tsx';
import { FreshFindsDrawerContent } from './FreshFindsDrawerContent.tsx';
import { useDownloadFreshFindsCsv } from '../hooks/useDownloadFreshFindsCsv';
import type { FreshFindsRecord } from '../types/data.types';
import { filterFreshFindsRecords } from '../utils/filterFreshFindsRecords';
import { articleTemplateData } from '../texts';

import '../FreshFindsFeature.css';

type FreshFindsTableRow = FreshFindsRecord & { __rowKey: string };

type FreshFindsTableProps = {
    records: FreshFindsRecord[];
    isLoading: boolean;
    error: unknown;
    dataProviderName: string;
    institutionLabel: string;
};

export const FreshFindsTable = ({
    records,
    isLoading,
    error,
    dataProviderName,
    institutionLabel,
}: FreshFindsTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { organisation } = useOrganisation();
    const { downloadCsv, isLoading: downloadCsvLoading } = useDownloadFreshFindsCsv();

    const filteredRecords = useMemo(
        () => filterFreshFindsRecords(records, searchTerm),
        [records, searchTerm],
    );

    const { isStartingPlan, displayData: billingPlanData } = useBillingPlanData(
        filteredRecords,
        organisation,
    );

    const customSorters = useMemo(() => getCustomSorters(), []);

    const {
        visibleData,
        hasMore,
        handleSort,
        handleLoadMore,
        totalLength,
    } = useTablePaginationAndSort<FreshFindsRecord>({
        data: billingPlanData,
        itemsPerPage: 10,
        customSorters,
    });

    const columns = useMemo(() => createColumns(), []);

    const dataWithUniqueKeys = useMemo(
        () =>
            visibleData.map((record, index) => ({
                ...record,
                __rowKey: `${String(record.DOI ?? '')}-${String(record.title ?? '')}-${index}`,
            })),
        [visibleData],
    );

    const drawerConfig: DrawerConfig<FreshFindsTableRow> = {
        enabled: true,
        content: (record) => (
            <FreshFindsDrawerContent
                record={record}
                institutionLabel={institutionLabel}
            />
        ),
        onRowClick: () => {},
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <CrPaper>
            <div className="fresh-finds-table-header">
                <h2 className="fresh-finds-table-header__title">
                    {articleTemplateData.table.title}
                </h2>
                <p className="fresh-finds-table-header__subtitle">
                    Papers we discovered elsewhere authored by{' '}
                    <strong>{dataProviderName}</strong> you might consider adding to your
                    repository.
                </p>
            </div>
            <div id="freshFindsTable">
                <CrTable<FreshFindsTableRow>
                    rowKey="__rowKey"
                    data={dataWithUniqueKeys}
                    columns={columns}
                    loading={isLoading}
                    error={error}
                    actions={[]}
                    sortable={!isStartingPlan}
                    onSort={handleSort}
                    onDownloadCsv={downloadCsv}
                    downloadCsvLoading={downloadCsvLoading}
                    showLoadMore={!isStartingPlan && hasMore}
                    onLoadMore={handleLoadMore}
                    loadMoreText="Show more"
                    size="middle"
                    bordered={false}
                    showFooter={!isStartingPlan}
                    totalLength={totalLength}
                    searchable={true}
                    searchPlaceholder="Authors or DOI…"
                    onSearch={handleSearch}
                    searchValue={searchTerm}
                    scroll={getScrollConfig()}
                    drawer={drawerConfig}
                />
                {isStartingPlan && (
                    <AccessPlaceholder
                        customWidth
                        description="To see and download the full list of fresh finds, become our Supporting or Sustaining member."
                    />
                )}
            </div>
        </CrPaper>
    );
};
