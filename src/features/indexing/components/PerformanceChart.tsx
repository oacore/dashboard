import classNames from 'classnames';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles.css';

interface ChartValue {
    name: string;
    value: string | number;
    color: string;
    [key: string]: unknown;
}

interface PerformanceChartProps {
    value?: number | string;
    rounded?: boolean;
    overviewChart?: boolean;
    caption?: string;
    values: ChartValue[];
    className?: string;
    minHeight?: number;
    stroke?: string;
    maxHeight?: number;
    valueSize?: 'small' | 'medium' | 'large' | 'extra-small';
}

const PerformanceChart = ({
    value,
    rounded = false,
    caption,
    values,
    className,
    minHeight = 300,
    stroke = '#e0e0e0',
    maxHeight,
    overviewChart,
    valueSize = 'medium',
}: PerformanceChartProps) => {
    return (
        <div className={classNames('performance-chart-container', className)}>
            <ResponsiveContainer
                className="performance-chart-inner"
                height={maxHeight || minHeight}
                minHeight={minHeight}
            >
                <PieChart>
                    <Pie
                        isAnimationActive={false}
                        stroke={stroke}
                        data={values}
                        startAngle={rounded ? 270 : 225}
                        endAngle={rounded ? -135 : -45}
                        innerRadius="90%"
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {values.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {value !== undefined && (
                <div className={classNames('performance-chart-label', {
                    [`numeric-value-${valueSize}`]: valueSize,
                    'numeric-value-bold': true,
                })}>
                    <span
                      className={classNames('performance-chart-count', {
                          'performance-chart-count-big': overviewChart,
                      })}
                    >
                        {typeof value === 'number' ? `${Math.round(value)}%` : value}
                    </span>
                    {caption && <span className="numeric-value-caption">{caption}</span>}
                </div>
            )}
        </div>
    );
};

export default PerformanceChart;
