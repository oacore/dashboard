import type { RioxxStats } from '@features/Validator/types';

export type BillingPlan = {
    billingType?: string | null;
};

export type OrcidCardProps = {
    count: number;
    outputsCount: number;
    enrichmentSize: number;
    onDownloadCsv?: () => void;
    billingPlan?: BillingPlan;
    showInfo?: boolean;
    error?: Error | null;
};

export type DiffStatisticsProps = {
    outputsCount: number;
    count: number;
};

export type ChartItem = {
    name: string;
    value: string | number;
    color: string;
};

//sdg
export interface CustomContentProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    color?: string;
    payload?: TreemapDataItem;
    [key: string]: unknown;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            name: string;
            title: string;
            size: number;
            color: string;
        };
    }>;
}

export interface TreemapDataItem {
    name: string;
    title: string;
    size: number;
    color: string;
    [key: string]: string | number;
}

//orcid

export interface PercentageChartProps extends React.HTMLAttributes<HTMLDivElement> {
    compliantCount: number;
    totalCount: number;
    children?: React.ReactNode;
    tag?: React.ElementType;
}

export interface ContentProps {
    compliantCount: number;
    totalCount: number;
    missingTerms: Array<{ elementName: string; outputsCount: number }>;
}

export interface RioxCardProps {
    rioxx: RioxxStats | null;
    isLoading?: boolean;
    error?: Error | null;
}
