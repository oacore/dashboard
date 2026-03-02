import React, { useState, useEffect } from 'react';
import InfoTooltip from '@components/common/InfoTooltip';
import { CrPaper } from '@core/core-ui';
import { formatNumber } from '@utils/helpers';
import { TextData } from '../texts';
import '../styles.css';

interface PublicationsDatesCardProps {
  fullCount?: number | null;
  partialCount?: number | null;
  noneCount?: number | null;
  error?: boolean;
}

const StackedVerticalBarChart = React.memo<{
  data: Array<{
    caption: string;
    background: string;
    color?: string;
    value: number;
  }>;
}>(({ data }) => {
  const [transformedData, setTransformedData] = useState<
    Array<{
      caption: string;
      background: string;
      color: string;
      percentage: number;
      value: number;
    }>
  >([]);

  useEffect(() => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    setTransformedData(
      data.map((el) => ({
        ...el,
        percentage: (el.value / total) * 100,
        color: el.color || 'var(--black)',
      }))
    );
  }, [data]);

  return (
    <div>
      <div className="publication-dates-container">
        {transformedData.map(
          ({ caption, background, color, percentage, value }) => (
            <div
              key={caption}
              title={`${caption} – ${value} (${percentage.toFixed(2)}%)`}
              className="publication-dates-bar"
              style={{
                flexGrow: percentage,
                background,
                color,
              }}
            >
              <span className="publication-dates-caption">{caption}</span>
              <span>{formatNumber(value)}</span>
            </div>
          )
        )}
      </div>

      <ul className="publication-dates-legend">
        {transformedData.map(({ caption, background, value }) => (
          <li key={caption} className="publication-dates-label">
            <div>
              <span
                className="publication-dates-color"
                style={{ background }}
              />
              {caption}
            </div>
            <div className="publication-dates-label-text-right">
              {value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

StackedVerticalBarChart.displayName = 'StackedVerticalBarChart';

export const PublicationsDatesCard = ({
  fullCount = 0,
  partialCount = 0,
  noneCount = 0,
  error = false,
}: PublicationsDatesCardProps) => {
  const isLoading = [fullCount, partialCount, noneCount].every((el) => el == null);
  const texts = TextData.publicationDates as NonNullable<typeof TextData.publicationDates>;

  const data: Array<{
    caption: string;
    background: string;
    color?: string;
    value: number;
  }> = [
    {
      value: fullCount || 0,
      caption: texts.matching,
      background: 'var(--success)',
    },
    {
      value: partialCount || 0,
      caption: texts.incorrect,
      background: 'var(--warning)',
    },
    {
      value: noneCount || 0,
      caption: texts.different,
      background: 'var(--danger)',
      color: 'var(--color-text-white)',
    },
  ].filter((el) => el.value > 0);

  return (
    <CrPaper className="compliance-card-inner-wrapper">
      <div id="cross-repository-check" className="number-header-wrapper">
        <h3 className="compliance-card-title">{texts.title}</h3>
        <InfoTooltip title={texts.tooltip} />
      </div>
      {texts.description && (
        <p className="compliance-sub-title">{texts.description}</p>
      )}
      {error && (
        <p className="no-data-message compliance-card-error-message">
          Failed to load publication dates data. Please try again later.
        </p>
      )}
      {!error && isLoading && <p>Loading data</p>}
      {!error && !isLoading && !data.length && <p>Loading data</p>}
      {!error && !isLoading && data.length > 0 && <StackedVerticalBarChart data={data} />}
    </CrPaper>
  );
};
