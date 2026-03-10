import { Markdown, CrPaper } from '@core/core-ui';
import { TimeLagChart } from './TimeLagChart';
import { TextData } from '../texts';
import type { DepositTimeLagItem } from '../hooks/useDepositTimeLag';

interface DepositTimeLagCardProps {
  timeLagData: DepositTimeLagItem[];
  isLoading: boolean;
  error?: boolean;
}

export const DepositTimeLagCard = ({
  timeLagData,
  isLoading,
  error = false,
}: DepositTimeLagCardProps) => {
  return (
    <CrPaper>
      <h3 className="compliance-card-title">{TextData.chart?.title}</h3>
      {error && (
        <p className="no-data-message compliance-card-error-message">
          Failed to load deposit time lag data. Please try again later.
        </p>
      )}
      {!error && timeLagData.length > 0 && (
        <div className="compliance-card-description">
          <TimeLagChart data={timeLagData} />
          {TextData.chart?.body && <Markdown>{TextData.chart.body}</Markdown>}
        </div>
      )}
      {!error && !timeLagData.length && !isLoading && (
        <p>{TextData?.noData?.body}</p>
      )}
    </CrPaper>
  );
};
