import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { TextData as duplicatesTextData } from '@features/Duplicates/texts';
import { TextData as daTextData } from '@features/Das/texts';
import { TextData as rrsTextData } from '@features/Rrs-policy/texts';
import { useRrsData } from '@features/Rrs-policy/hooks/useRrsData.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import './styles.css';
import { useDasData } from '@features/Das/hooks/useDasData.ts';
import { useDuplicatesData } from '@features/Duplicates/hooks/useDuplicatesData.ts';
import { useOrcidStats } from '@features/Orcid/hooks/useOrcidData.ts';
import { useDataProviderStatistics } from '@hooks/useDataProviderStatistics.ts';
import { useDoiStatistics } from '@features/Doi/hooks/useDoiStatistics.ts';
import { useDownloadOrcidBasicCsv } from '@features/Orcid/hooks/useDownloadOrcidBasicCsv';
import { DoiCard } from '@features/Overview/components/DoiCard.tsx';
import { OrcidCard } from '@features/Overview/components/OrcidCard.tsx';
import { SdgCard } from '@features/Overview/components/SdgCard.tsx';
import { RioxCard } from '@features/Overview/components/RioxCard.tsx';
import { DepositingCard } from '@features/Overview/components/DepositingCard';
import DataStatisticsCard from '@features/Overview/components/DataStatisticsCard.tsx';
import { useRioxxStats } from '@features/Validator/hooks/useRioxxStats';
import { useDepositTimeLag } from '@features/DepositCompliance/hooks/useDepositTimeLag';
import { useComplianceLevel } from '@features/DepositCompliance/hooks/useComplianceLevel';
import { useHarvestingStatus } from '@features/indexing/hooks/useHarvestingStatus.ts';
import placeholder from '@/assets/icons/chartPlaceholder.svg';
import { CrPaper } from '@core/core-ui';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const OverviewFeature = () => {

  const { selectedDataProvider, selectedSetSpec } = useDataProviderStore();
  const { buildPath } = useDashboardRoute();
  const { downloadCsv, isLoading: isDownloadingOrcidCsv } = useDownloadOrcidBasicCsv();

  const {
    data: duplicatesData,
    error: duplicatesError,
    isLoading: duplicatesIsLoading,
  } = useDuplicatesData(selectedDataProvider?.id || 0);

  const {
    data: dasData,
    error: dasError,
    isLoading: dasIsLoading,
  } = useDasData(selectedDataProvider?.id || 0);

  const {
    data: rrsData,
    error: rrsError,
    isLoading: rrsIsLoading,
  } = useRrsData(selectedDataProvider?.id || 0);

  const {
    statistics,
    error: statisticsError,
    isLoading: statisticsIsLoading,
  } = useDataProviderStatistics(
    selectedDataProvider?.id ?? null,
    selectedSetSpec
  );

  const {
    harvestingStatus,
    isLoading: harvestingStatusIsLoading,
    harvestingError,
  } = useHarvestingStatus(false);


  const { doiStatistics, error: doiError } = useDoiStatistics(
    selectedDataProvider?.id ?? null,
    selectedSetSpec
  );

  const { stats, error: orcidError } = useOrcidStats(selectedDataProvider?.id || 0);

  const { rioxx, isLoading: rioxxIsLoading, error: rioxxError } = useRioxxStats(selectedDataProvider?.id);

  const { timeLagData, isLoading: timeLagIsLoading, isError: depositTimeLagError } = useDepositTimeLag();
  const { complianceLevel } = useComplianceLevel(timeLagData);

  const countryCode = selectedDataProvider?.location?.countryCode;

  const handleGuideClick = () => {
    window.open('https://core.ac.uk/documentation/membership-documentation', '_blank');
  };

  if (harvestingStatusIsLoading || statisticsIsLoading) {
    return (
      <div className="overview-loading-wrapper">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <p className="overview-loading-text">Loading overview...</p>
      </div>
    );
  }

  if (harvestingError) {
    return (
      <div className="overview-loading-wrapper overview-error-wrapper">
        <p className="overview-loading-text">Failed to load overview data. Please refresh the page.</p>
      </div>
    );
  }

  const hasHarvestingData = harvestingStatus != null && !harvestingError;
  const hasStatisticsData = statistics != null && !statisticsError;
  const shouldShowBlockedView =
    (hasHarvestingData && harvestingStatus?.lastHarvestingDate == null) ||
    (hasStatisticsData && statistics?.countMetadata == null);

  if (shouldShowBlockedView) {
    return (
      <CrPaper className="placeholder-card">
        <h2 className="placeholder-card-title">General information</h2>
        <div className="placeholder-inner-content">
          <img
            src={placeholder}
            alt="placeholder"
            className="placeholder-logo"
          />
          <h5 className="placeholder-title">
            Your repository is still indexing.
          </h5>
          <p className="placeholder-description">
            This can take up to 3 weeks depending on the size of the data
            provider and our workload. You will receive an email once this
            has been done. In the meantime, find out more about how to
            ensure your repository is indexed to maximum effect in the Data
            Provider&apos;s Guide.
          </p>
          <Button
            type="primary"
            onClick={handleGuideClick}
            aria-label="Open Data Provider's Guide"
          >
            Data Provider&apos;s Guide
          </Button>
        </div>
      </CrPaper>
    );
  }

  return (
    <div className="overview-container">
      <DataStatisticsCard
        metadatadaHistory={statistics?.history}
        metadataCount={statistics?.countMetadata}
        fullTextCount={statistics?.countFulltext}
        dataProviderId={selectedDataProvider?.id}
        error={statisticsError}
      />
      {countryCode?.toLowerCase() === 'gb' && (
        <DepositingCard
          chartData={timeLagData}
          complianceLevel={complianceLevel}
          dataProviderId={selectedDataProvider?.id}
          countryCode={countryCode}
          isLoading={timeLagIsLoading}
          error={depositTimeLagError}
        />
      )}
      {rioxx != null && rioxx.totalCount > 0 && (
        <RioxCard
          rioxx={rioxx}
          isLoading={rioxxIsLoading}
          error={rioxxError}
        />
      )}
      {/*TEMP REMOVED, IN OLD*/}
      {/* {viewStatistics != null && <IrusCard statistics={viewStatistics} />} */}
      {(doiStatistics?.dataProviderDoiCount || doiError) && (
        <DoiCard
          doiCount={doiStatistics?.dataProviderDoiCount ?? 0}
          outputsCount={statistics?.countMetadata ?? 0}
          enrichmentSize={
            (doiStatistics?.totalDoiCount ?? 0) - (doiStatistics?.dataProviderDoiCount ?? 0)
          }
          error={doiError}
        />
      )}
      <SdgCard />
      <OrcidCard
        count={stats.basic}
        enrichmentSize={
          stats.fromOtherRepositories
        }
        outputsCount={statistics?.countMetadata ?? 0}
        onDownloadCsv={downloadCsv}
        downloadCsvLoading={isDownloadingOrcidCsv}
        error={orcidError}
      />
      <CrStatsCard
        countClassName="overview-count"
        title={duplicatesTextData.statsCard.title}
        description={duplicatesTextData.statsCard.description}
        count={duplicatesData.length}
        loading={duplicatesIsLoading}
        error={duplicatesError}
        actionText={duplicatesTextData.statsCard.subAction}
        actionHref={buildPath('deduplication')}
      />
      <CrStatsCard
        countClassName="overview-count"
        title={daTextData.statsCard.title}
        description={daTextData.statsCard.description}
        count={dasData.length}
        loading={dasIsLoading}
        error={dasError}
        actionText={daTextData.statsCard.subAction}
        actionHref={buildPath('das')}
      />
      <CrStatsCard
        countClassName="overview-count"
        title={rrsTextData.statsCard.title}
        description={rrsTextData.statsCard.description}
        count={rrsData.length}
        loading={rrsIsLoading}
        error={rrsError}
        actionText={rrsTextData.statsCard.subAction}
        actionHref={buildPath('rights-retention-strategy')}
      />
    </div>
  )
}
