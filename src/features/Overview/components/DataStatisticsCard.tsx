import { Card, Button } from 'antd';
import classNames from 'classnames';
import {Markdown, InfoTooltip, NumericValue} from '@oacore/core-ui';
import FullTextsProgressChart from '@features/indexing/components/FullTextsProgressChart';
import { valueOrDefault, formatDate } from '@/utils/helpers.ts';
import { TextData } from '../texts';
import { useHarvestingDate } from '../hooks/useHarvestingDate';
import AreaChart from './AreaChart';
import '../styles.css';

const COLORS = {
  primary: 'var(--color-primary, #EF8237)',
  gray200: 'var(--color-border, #d9d9d9)',
};

type ActionButtonProps = {
  onClick: () => void;
  text: string;
  active: boolean;
};

const ActionButton = ({ onClick, text, active }: ActionButtonProps) => (
  <Button
    type={active ? 'primary' : 'text'}
    size="small"
    onClick={onClick}
    className={classNames('chart-action-button', { 'action-button-active': active })}
    aria-label={text}
    aria-pressed={active}
  >
    {text}
  </Button>
);

type ActionsBarProps = {
  onSetActiveType: (name: string) => void;
  activeType: string;
};

const ActionsBar = ({ onSetActiveType, activeType }: ActionsBarProps) => {
  const text = TextData.dataStatistics;
  const handleButtonClick = (name: string) => {
    onSetActiveType(name);
  };

  return (
    <div className="actions-bar">
      {Object.values(text.actions).map((action: { name: string }) => (
        <ActionButton
          onClick={() => handleButtonClick(action.name)}
          key={action.name}
          text={action.name}
          active={activeType === action.name}
        />
      ))}
      <InfoTooltip
        title={text.cardTooltip}
        ariaLabel={text.cardTooltip}
        iconStyle={{ color: '#757575' }}
      />
    </div>
  );
};

type DataStatisticsCardProps = {
  metadatadaHistory?: Record<string, number> | null;
  metadataCount?: number;
  fullTextCount?: number;
  dataProviderId?: number;
  harvestingDate?: string;
  errorCount?: number;
  warningCount?: number;
  viewStatistics?: unknown;
  error?: Error | null;
};

const DataStatisticsCard = ({
  metadatadaHistory,
  metadataCount,
  fullTextCount,
  dataProviderId,
  error = null,
  ...restProps
}: DataStatisticsCardProps) => {
  const text = TextData.dataStatistics;
  const defaultActiveFilterType = text.actions.find(
    (action: { defaultActive?: boolean }) => action.defaultActive
  )?.name ?? 'Year';
  const { barChartValues, activeType, onSetActiveType } = useHarvestingDate(
    metadatadaHistory,
    defaultActiveFilterType
  );

  const performanceChartValues = [
    {
      name: 'Full text',
      value: fullTextCount ?? 0,
      color: COLORS.primary,
    },
    {
      name: 'Without full text',
      value: (metadataCount ?? 0) - (fullTextCount ?? 0),
      color: COLORS.gray200,
    },
  ];

  const renderHeader = () => (
    <div className="card-header-wrapper">
      <h2 className="card-title">{text.title}</h2>
      {barChartValues.length >= 2 && (
        <ActionsBar activeType={activeType} onSetActiveType={onSetActiveType} />
      )}
    </div>
  );

  const renderCardContent = () => {
    if (error) {
      return (
        <p className="no-data-message overview-card-error-message">
          Failed to load data statistics. Please try again later.
        </p>
      );
    }

    return (
      <>
        <div className="info-card-content">
          <div className="chart-info-box">
            <div className="chart-info-header">
              <Markdown className={classNames('subtitle', 'metadata')}>
                {text.metadata.title}
              </Markdown>
              <InfoTooltip
                title={
                  <Markdown className="tooltip-markdown">
                    {`Number of metadata records CORE has been able to index from your repository. If this number seems too low, then please ensure that your repository is compliant with the [CORE Data Provider's Guide](${dataProviderId != null ? `/data-providers/${dataProviderId}/documentation` : '/'}). You can also check for any issues we might have detected with your repository on the [Indexing status tab.](${dataProviderId != null ? `/data-providers/${dataProviderId}/indexing` : '/indexing'})`}
                  </Markdown>
                }
                mouseEnterDelay={0.3}
                mouseLeaveDelay={0.3}
              />
            </div>
            <NumericValue
              bold
              value={valueOrDefault(metadataCount ?? undefined, 'Loading...')}
            />
          </div>
          {fullTextCount != null && (
            <FullTextsProgressChart
              fullTextCount={fullTextCount}
              tooltip={
                <Markdown className="tooltip-markdown">
                  {`Number of full-text CORE has been able to index from your repository. If this number seems too low, then please ensure that your repository is compliant with the [CORE Data Provider's Guide](${dataProviderId != null ? `/data-providers/${dataProviderId}/documentation` : '/'}). You can also check for any issues we might have detected with your repository on the [Indexing status tab.](${dataProviderId != null ? `/data-providers/${dataProviderId}/indexing` : '/indexing'})`}
                </Markdown>
              }
              chartValues={performanceChartValues}
              className="info-card-chart"
              caption={text.metadata.caption}
              value={valueOrDefault(
                metadataCount ? (fullTextCount / metadataCount) * 100 : undefined,
                '🔁'
              )}
            />
          )}
        </div>
        {barChartValues.length >= 2 ? (
          <AreaChart
            data={barChartValues.map(({ date, value }) => ({
              name: formatDate(date, {
                month: 'short',
                year: '2-digit',
              }),
              'Metadata count': value,
            }))}
          />
        ) : (
          <p className="no-chart-data-message">
            There is not enough historical data to display on a chart.
          </p>
        )}
      </>
    );
  };

  return (
    <Card
      className={classNames('overview-card', 'info-card')}
      title={renderHeader()}
      {...restProps}
    >
      {renderCardContent()}
    </Card>
  );
};

export default DataStatisticsCard;
