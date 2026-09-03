import { useMemo } from 'react';
import { AccessPlaceholder, CrPaper } from '@oacore/core-ui';

import { CrDrawer } from '@components/common/CrDrawer/CrDrawer.tsx';
import { CrTable } from '@components/common/CrTable/CrTable.tsx';
import type { DrawerConfig } from '@components/common/CrTable/types.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useDataProviderStore } from '@/store/dataProviderStore';

import { createColumns } from './FreshFindsColumns.tsx';
import { actions } from './tableActions.tsx';
import { useDownloadFreshFindsCsv } from '../hooks/useDownloadFreshFindsCsv';
import { useFreshFindsData } from '../hooks/useFreshFindsData';
import { useFreshFindsStore } from '../store/freshFindsStore';
import type { FreshFindsRecord } from '../types/data.types';
import { articleTemplateData } from '../texts';

type FreshFindsTableRow = FreshFindsRecord & { __rowKey: string };

type FreshFindsTableProps = {
  dataProviderName: string;
};

export const FreshFindsTable = ({ dataProviderName }: FreshFindsTableProps) => {
  const { searchTerm, setSearchTerm } = useFreshFindsStore();
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const { downloadCsv, isLoading: downloadCsvLoading } = useDownloadFreshFindsCsv();

  const {
    data: accumulatedData,
    error,
    isLoading,
    isLoadingMore,
    loadMore,
    totalLength,
    hasMore,
  } = useFreshFindsData(10, selectedDataProvider?.id || 0);

  const { isStartingPlan, displayData } = useBillingPlanData(accumulatedData, organisation);

  const columns = useMemo(() => createColumns(), []);

  const dataWithUniqueKeys = useMemo(
    () =>
      displayData.map((record) => ({
        ...record,
        __rowKey: String(record.workId),
      })),
    [displayData],
  );

  const drawerConfig: DrawerConfig<FreshFindsTableRow> = useMemo(
    () => ({
      enabled: true,
      content: (record: FreshFindsTableRow) => {
        const doi = record.doi?.trim() ?? '';

        return (
        <div className="drawer-wrapper fresh-finds-drawer-wrapper">
          <CrDrawer
            article={{
              id: `fresh-finds-${record.workId}`,
              title: record.title?.trim() || 'Fresh find',
              doi: doi !== '' ? doi : undefined,
              authors: record.authors?.map((author) => ({
                name: author.trim() || '—',
              })),
            }}
            isLoading={false}
            removeLiveActions
            hideRepositoryButton
            outputsUrl={doi !== '' ? `https://doi.org/${encodeURIComponent(doi)}` : 'https://core.ac.uk/'}
          />
        </div>
        );
      },
    }),
    [],
  );

  return (
    <CrPaper>
      <div className="fresh-finds-table-header">
        <h2 className="fresh-finds-table-header__title">
          {articleTemplateData.table.title}
        </h2>
        <p className="fresh-finds-table-header__subtitle">
          Papers we discovered elsewhere authored by <strong>{dataProviderName}</strong> you might
          consider adding to your repository.
        </p>
      </div>
      <div id="freshFindsTable">
        <CrTable<FreshFindsTableRow>
          rowKey="__rowKey"
          data={dataWithUniqueKeys}
          columns={columns}
          loading={isLoading}
          error={error}
          actions={actions}
          onDownloadCsv={downloadCsv}
          downloadCsvLoading={downloadCsvLoading}
          showLoadMore={!isStartingPlan && hasMore}
          onLoadMore={loadMore}
          loadMoreText="Show more"
          loadMoreLoading={isLoadingMore}
          size="middle"
          bordered={false}
          showFooter={!isStartingPlan}
          totalLength={totalLength}
          searchable={!isStartingPlan}
          searchPlaceholder="Title, author, or DOI…"
          onSearch={setSearchTerm}
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
