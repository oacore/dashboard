import classNames from 'classnames';
import NumericValue from '@/components/common/NumericValue/NumericValue';
import PerformanceChart from './PerformanceChart';
import '../styles.css';
import InfoTooltip from '@components/common/InfoTooltip';
import React from 'react';

interface ChartValue {
    name: string;
    value: string | number;
    color: string;
    [key: string]: unknown;
}

interface FullTextsProgressChartProps {
    value?: number | string;
    chartValues: ChartValue[];
    caption?: string;
    fullTextCount?: number;
    className?: string;
    tooltip?: React.ReactNode;
}

const FullTextsProgressChart = ({
    value,
    chartValues,
    caption,
    fullTextCount,
    className,
    tooltip,
}: FullTextsProgressChartProps) => (
    <div
        className={classNames('fulltexts-progress-chart', 'info-box', className)}
    >
        <InfoTooltip positioned title={tooltip} />
        <PerformanceChart
            minHeight={110}
            rounded
            className="info-chart"
            values={chartValues}
            value={value}
            valueSize="extra-small"
        />
        <NumericValue
            className="fulltexts-progress-label"
            value={(fullTextCount ?? 'Loading...')}
            size="small"
            caption={caption}
        />
    </div>
);

export default FullTextsProgressChart;
