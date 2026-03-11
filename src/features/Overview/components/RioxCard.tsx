import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import type { PercentageChartProps, ContentProps, RioxCardProps } from '../types';
import { formatNumber } from '@/utils/helpers.ts';
import { Markdown } from '@core/core-ui';
import '../styles.css';
import validatorData from "../../Validator/texts";

const RIOXX_SPEC_URL = 'https://rioxx.net/profiles/v3-0-final/';

const PercentageChart = ({
    compliantCount,
    totalCount,
    children,
    className,
    tag: Tag = 'div',
    ...htmlProps
}: PercentageChartProps) => {
    const complianceLevel = totalCount > 0 ? compliantCount / totalCount : 0;

    const mainLabelText = `${formatNumber(complianceLevel * 100, {
        maximumFractionDigits: 2,
    })}%`;

    const secondaryLabelText = `${formatNumber((1 - complianceLevel) * 100, {
        maximumFractionDigits: 2,
    })}%`;

    return (
        <Tag className={classNames('rioxx-row', className)} {...htmlProps}>
            <div className="rioxx-bar" style={{ flexGrow: complianceLevel }}>
                {complianceLevel >= 0.2 && mainLabelText}
            </div>
            <div
                className={classNames('rioxx-bar', 'rioxx-bar-empty')}
                style={{ flexGrow: 1 - complianceLevel }}
            >
                {complianceLevel >= 0.1 &&
                    complianceLevel <= 0.94 &&
                    secondaryLabelText}
            </div>
            <span className="sr-only">{children}</span>
        </Tag>
    );
};

const Content = ({ compliantCount, totalCount, missingTerms }: ContentProps) => (
    <>
        <PercentageChart
            compliantCount={compliantCount}
            totalCount={totalCount}
            className="rioxx-chart"
            title={`${formatNumber(compliantCount)} out of ${formatNumber(
                totalCount
            )} outputs are compliant with basic RIOXX`}
        >
            compliant with RIOXX
        </PercentageChart>
        {missingTerms && missingTerms.length > 0 && (
            <ul className="rioxx-issues-list">
                {missingTerms.map(({ elementName, outputsCount }) => (
                    <li key={elementName}>
                        <span>{formatNumber(outputsCount)}</span>
                        &nbsp;outputs are missing&nbsp;
                        <code>{elementName}</code>
                    </li>
                ))}
            </ul>
        )}
        <Button
            type="default"
            className="rioxx-link-button"
            href={RIOXX_SPEC_URL}
            target="_blank"
            rel="noopener noreferrer"
        >
            Learn more
        </Button>
    </>
);

export const RioxCard = ({ rioxx, isLoading = false, error }: RioxCardProps) => {
    if (error) {
        return (
            <Card className="overview-card" title={validatorData.validator.card.title}>
                <p className="no-data-message overview-card-error-message">
                    Failed to load Rioxx data. Please try again later.
                </p>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="overview-card" title={validatorData.validator.card.title}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            </Card>
        );
    }

    if (!rioxx) {
        return (
            <Card className="overview-card" title={validatorData.validator.card.title}>
                <div>No Rioxx data available</div>
            </Card>
        );
    }

    return (
        <Card className="overview-card spread-card rioxx-card-warning" title={validatorData.validator.card.title}>
            <Markdown className="rioxx-subtitle">{validatorData.validator.card.description}</Markdown>
            <Content
                compliantCount={rioxx.partiallyCompliantCount}
                totalCount={rioxx.totalCount}
                missingTerms={rioxx.missingTermsBasic || []}
            />
        </Card>
    );
};
