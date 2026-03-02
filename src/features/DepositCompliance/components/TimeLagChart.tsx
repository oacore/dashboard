
import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ReferenceLine,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import classNames from 'classnames';
import type { DepositTimeLagItem } from '../hooks/useDepositTimeLag';
import '../styles.css';

// Constants
const AGGREGATION_SIZE = 14;
const COMPLIANCE_THRESHOLD_DAYS = 90;
const DAYS_IN_YEAR = 365;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 31;

// Build custom ticks map more efficiently
const buildCustomTicks = (): Record<number, string> => {
    const ticks: Record<number, string> = {
        [DAYS_IN_WEEK]: '1w',
        [DAYS_IN_MONTH]: '1m',
        [COMPLIANCE_THRESHOLD_DAYS]: '90d',
    };

    // Add year markers for -15 to +15 years
    for (let i = 1; i <= 15; i++) {
        ticks[-i * DAYS_IN_YEAR] = `${-i}y`;
        ticks[i * DAYS_IN_YEAR] = `${i}y`;
    }

    return ticks;
};

const customTicks = buildCustomTicks();

interface AggregatedDataItem {
    key: string;
    value: {
        total: number;
        avg: number;
    };
}

const isInInterval = (
    groupIndex: number,
    dayIndex: number,
    groupSize: number = AGGREGATION_SIZE
): boolean => {
    const startDay = groupIndex * groupSize;
    const endDay = startDay + groupSize - 1;
    return dayIndex >= startDay && dayIndex <= endDay;
};

const isTick = (groupIndex: number): boolean => {
    return Object.keys(customTicks).some((dayStr) => {
        const day = parseInt(dayStr, 10);
        return isInInterval(groupIndex, day);
    });
};

const formatTickLabel = (groupIndexStr: string): string => {
    const groupIndex = parseInt(groupIndexStr, 10);

    const tickEntry = Object.entries(customTicks).find(([dayStr]) => {
        const day = parseInt(dayStr, 10);
        return isInInterval(groupIndex, day);
    });

    return tickEntry ? tickEntry[1] : '';
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value?: number;
        payload?: AggregatedDataItem;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const payloadItem = payload[0];
    const dataEntry = payloadItem?.payload;

    if (!dataEntry?.value) return null;

    const { total } = dataEntry.value;
    const groupIndex = parseInt(label || '0', 10);
    const startDay = groupIndex * AGGREGATION_SIZE;
    const endDay = startDay + AGGREGATION_SIZE - 1;

    const safeTotal = typeof total === 'number' ? total : 0;

    // Format the day range
    let dayRangeText: string;
    if (startDay < 0) {
        // Before publication: show absolute values in descending order (e.g., "14 - 1")
        const absStart = Math.abs(startDay);
        const absEnd = Math.abs(endDay);
        dayRangeText = `${Math.max(absStart, absEnd)} - ${Math.min(absStart, absEnd)} days before publication`;
    } else if (startDay > 0) {
        // After publication: show range in ascending order
        dayRangeText = `${startDay} - ${endDay} days after publication`;
    } else {
        // At or around publication (0 days)
        if (endDay < 0) {
            dayRangeText = `${Math.abs(endDay)} - 0 days before publication`;
        } else if (endDay === 0) {
            dayRangeText = '0 days (at publication)';
        } else {
            dayRangeText = `0 - ${endDay} days after publication`;
        }
    }

    return (
        <div className="custom-tooltip">
            <p>{safeTotal} works deposited in</p>
            <p>{dayRangeText}</p>
        </div>
    );
};

interface TimeLagChartProps {
    data: DepositTimeLagItem[];
    width?: string | number;
    height?: number;
}

const normalizeData = (data: DepositTimeLagItem[]): DepositTimeLagItem[] => {
    if (data.length === 0) return [];

    const minLag = data[0].depositTimeLag;
    const maxLag = data[data.length - 1].depositTimeLag;
    const intervalSize = maxLag - minLag;
    const dataMap = new Map(data.map((item) => [item.depositTimeLag, item.worksCount]));

    const normalized: DepositTimeLagItem[] = [];
    const totalDays = intervalSize + (intervalSize % AGGREGATION_SIZE);

    for (let i = 0; i <= totalDays; i++) {
        const lagIndex = minLag + i;
        normalized.push({
            depositTimeLag: lagIndex,
            worksCount: dataMap.get(lagIndex) ?? 0,
        });
    }

    return normalized;
};

const aggregateData = (normalizedData: DepositTimeLagItem[]): AggregatedDataItem[] => {
    const grouped = new Map<number, DepositTimeLagItem[]>();

    normalizedData.forEach((item) => {
        const groupIndex = Math.floor(item.depositTimeLag / AGGREGATION_SIZE);
        if (!grouped.has(groupIndex)) {
            grouped.set(groupIndex, []);
        }
        grouped.get(groupIndex)!.push(item);
    });

    return Array.from(grouped.entries())
        .map(([groupIndex, items]) => {
            const total = items.reduce((sum, item) => sum + item.worksCount, 0);
            const avg = items.length > 0 ? total / items.length : 0;
            return {
                key: groupIndex.toString(),
                value: { total, avg },
            };
        })
        .sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
};

export const TimeLagChart = React.memo<TimeLagChartProps>(
    ({ data, width = '100%', height = 300 }) => {
        const aggregatedData = useMemo<AggregatedDataItem[]>(() => {
            if (!data || data.length === 0) return [];

            const normalized = normalizeData(data);
            return aggregateData(normalized);
        }, [data]);

        const ticks = useMemo(
            () =>
                aggregatedData
                    .filter((item) => isTick(parseInt(item.key, 10)))
                    .map((item) => item.key),
            [aggregatedData]
        );

        const isCompliant = (groupIndex: number): boolean => {
            return groupIndex * AGGREGATION_SIZE < COMPLIANCE_THRESHOLD_DAYS;
        };

        if (aggregatedData.length === 0) return null;

        return (
            <ResponsiveContainer width={width as number | `${number}%`} height={height}>
                <BarChart margin={{ bottom: -5 }} data={aggregatedData}>
                    <XAxis
                        dataKey="key"
                        tickLine={false}
                        ticks={ticks}
                        tickFormatter={formatTickLabel}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} className="reference-line" />
                    <Bar dataKey="value.total">
                        {aggregatedData.map((entry) => {
                            const groupIndex = parseInt(entry.key, 10);
                            return (
                                <Cell
                                    className={classNames({
                                        'lag-bar': true,
                                        compliant: isCompliant(groupIndex),
                                    })}
                                    key={entry.key}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
);

TimeLagChart.displayName = 'TimeLagChart';

