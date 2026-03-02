import { useHarvestingStatus } from './hooks/useHarvestingStatus';
import { useHarvestingRequest } from './hooks/useHarvestingRequest';
import { useIssuesAggregation } from './hooks/useIssuesAggregation';
import { useDataProviderStatistics } from '@/hooks/useDataProviderStatistics';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { HarvestingProgressCard } from '@features/indexing/components/HarvestingProgressCard.tsx';
import BaseHarvestingCard from './components/BaseHarvestingCard';
import FullTextsProgressChart from './components/FullTextsProgressChart';
import { customColors, antdTheme } from '@/config/theme';
import { patchValueFull, formatDate } from '@utils/helpers.ts';
import infoIcon from '@/assets/icons/info.svg';
import './styles.css';
import { TypesList } from '@features/indexing/components/TypesList.tsx';
import Markdown from '@components/common/Markdown/Markdown.tsx';

export const IndexingFeature = () => {
  const { selectedDataProvider, selectedSetSpec } = useDataProviderStore();
  const { harvestingStatus, harvestingError, mutate: refreshHarvestingStatus, isLoading: isHarvestingLoading } = useHarvestingStatus(false);
  const { sendHarvestingRequest, isLoading: isRequestLoading, error: requestError, responseData } = useHarvestingRequest();
  const issuesAggregation = useIssuesAggregation();
  const { statistics, error: statisticsError } = useDataProviderStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);

  const fullTextPercentage = statistics?.countMetadata && statistics.countMetadata > 0
    ? (statistics?.countFulltext ?? 0) / statistics.countMetadata * 100
    : undefined;
  
  return (
    <div className="indexing-feature-wrapper">
      <div className="harvesting-header-wrapper">
        <BaseHarvestingCard
          value={
            harvestingError ? (
              <div className="harvesting-errors-wrapper">
                <img className="harvesting-info-icon" src={infoIcon} alt="info" />
                <p className="harvesting-error-text">
                  Failed to load last update data. Please try again later.
                </p>
              </div>
            ) : (
              formatDate(harvestingStatus?.lastHarvestingDate || 0)
            )
          }
          title="Last successful updating"
        >
          {!harvestingError && issuesAggregation.typesCount && issuesAggregation.globalsCount && (
            <div className="error-wrapper">
              <p className="errors-info">
                indexed with
                <span className="numbers-count">
                  {' '}
                  {patchValueFull('{{errorsCount}}', { errorsCount: issuesAggregation.typesCount })}{' '}
                </span>
                issue types affecting <span className="numbers-count"> {patchValueFull('{{total}}', { total: issuesAggregation.globalsCount })}{' '} </span>
                records
              </p>
            </div>
          )}
        </BaseHarvestingCard>
        <BaseHarvestingCard
          value={
            statisticsError ? (
              <div className="harvesting-errors-wrapper">
                <img className="harvesting-info-icon" src={infoIcon} alt="info" />
                <p className="harvesting-error-text">
                  Failed to load harvested outputs data. Please try again later.
                </p>
              </div>
            ) : (
              statistics?.countMetadata ?? 'Loading...'
            )
          }
          title="Total harvested outputs"
        >
          {!statisticsError && (
          <FullTextsProgressChart
            className="harvesting-chart"
            fullTextCount={statistics?.countFulltext}
            tooltip={
              <Markdown className="tooltip-markdown">
                {`Number outputs CORE has been able to index from your repository. If this number seems too low, then please ensure that your repository is compliant with the [CORE Data Provider’s Guide](${selectedDataProvider?.id != null ? `/data-providers/${selectedDataProvider?.id}/documentation` : '/documentation'}). You can also check for any issues we might have detected with your repository below.`}
              </Markdown>
            }
            chartValues={[
              {
                name: 'Full text',
                value: statistics?.countFulltext ?? 0,
                color: customColors.primary,
              },
              {
                name: 'Without full text',
                value: (statistics?.countMetadata ?? 0) - (statistics?.countFulltext ?? 0),
                color: antdTheme.token?.colorBorder || '#E0E0E0',
              },
            ]}
            caption="Full texts"
            value={fullTextPercentage ?? '🔁'}
          />
          )}
        </BaseHarvestingCard>
        <HarvestingProgressCard
          harvestingStatus={harvestingStatus}
          sendHarvestingRequest={sendHarvestingRequest}
          harvestingError={harvestingError}
          refreshHarvestingStatus={refreshHarvestingStatus}
          isRequestLoading={isRequestLoading}
          requestError={requestError}
          requestResponse={responseData}
          isHarvestingLoading={isHarvestingLoading}
        />
      </div>
      <TypesList
        aggregation={issuesAggregation.aggregation}
        isLoading={issuesAggregation.isLoading}
        error={issuesAggregation.aggregationError}
      />
    </div>
  );
};
