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
import { FreshFindsDepositFilter } from './FreshFindsDepositFilter.tsx';
import { useDepositFreshFind } from '../hooks/useDepositFreshFind';
import { useDownloadFreshFinds } from '../hooks/useDownloadFreshFindsCsv';
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
  const { csv, json, bibtex, research } = useDownloadFreshFinds();

  const extraDownloads = useMemo(
    () => [
      {
        key: 'json',
        label: 'Download JSON',
        onClick: json.download,
        loading: json.isLoading,
      },
      {
        key: 'bibtex',
        label: 'Download BibTeX',
        onClick: bibtex.download,
        loading: bibtex.isLoading,
      },
      {
        key: 'research',
        label: 'Download Research',
        onClick: research.download,
        loading: research.isLoading,
      },
    ],
    [
      json.download,
      json.isLoading,
      bibtex.download,
      bibtex.isLoading,
      research.download,
      research.isLoading,
    ],
  );

  const {
    data: accumulatedData,
    error,
    isLoading,
    isLoadingMore,
    loadMore,
    mutate,
    totalLength,
    hasMore,
  } = useFreshFindsData(10, selectedDataProvider?.id || 0);
  const { depositWork, depositingWorkId } = useDepositFreshFind(() => mutate());

  const { isStartingPlan, displayData } = useBillingPlanData(accumulatedData, organisation);

  const columns = useMemo(
    () => createColumns({ onAddToRepository: depositWork, depositingWorkId }),
    [depositWork, depositingWorkId],
  );

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
          We have fount <strong>{totalLength}</strong> papers authored by  <strong>{dataProviderName}</strong> you might consider adding to your repository
        </p>
      </div>
      <div id="freshFindsTable">
        <CrTable<FreshFindsTableRow>
          rowKey="__rowKey"
          data={dataWithUniqueKeys}
          columns={columns}
          loading={isLoading}
          error={error}
          // TODO: enable row actions from ./tableActions
          actions={[]}
          onDownloadCsv={csv.download}
          downloadCsvLoading={csv.isLoading}
          extraDownloads={extraDownloads}
          showLoadMore={!isStartingPlan && hasMore}
          onLoadMore={loadMore}
          loadMoreText="Show more"
          loadMoreLoading={isLoadingMore}
          size="middle"
          bordered={false}
          showFooter={!isStartingPlan}
          totalLength={totalLength}
          beforeSearch={!isStartingPlan ? <FreshFindsDepositFilter /> : undefined}
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
