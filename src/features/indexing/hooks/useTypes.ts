import { useState, useEffect, useCallback, useMemo } from 'react';
import texts from '../texts';
import type { IssuesAggregation, IssueMessage } from '../types';

interface IssueItem {
    actualType: string;
    title: string;
    severity: string;
    outputsAffectedCount: number;
    type?: string;
    description?: string;
    resolution?: string;
    trigger?: string;
    details?: string[];
    hidden?: boolean;
}

interface UseTypesReturn {
    issueList: IssueItem[];
    onChangeIssueList: (actionName: string) => void;
    activeType: string;
}

const SEVERITY_MAP: Record<string, number> = {
    ERROR: 2,
    WARNING: 1,
};

const useTypes = (
    aggregations: IssuesAggregation | null,
    initialType: string
): UseTypesReturn => {
    const [activeType, setActiveType] = useState(initialType || 'ERROR');
    const [issueList, setIssueList] = useState<IssueItem[]>([]);

    const transformedList = useMemo<IssueItem[]>(() => {
        if (!aggregations?.countByType) {
            return [];
        }

        const defaultIssuesList = Object.entries(aggregations.countByType)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => {
                const message = texts.messages[type] as IssueMessage | undefined;
                return {
                    ...message,
                    actualType: type,
                    title: message?.title || type,
                    severity: message?.severity || 'ERROR',
                    outputsAffectedCount: count,
                } as IssueItem;
            });

        defaultIssuesList.sort((a, b) => {
            if (a.severity === b.severity) {
                return (a.type || a.actualType).localeCompare(b.type || b.actualType);
            }

            const severityA = SEVERITY_MAP[a.severity] ?? 0;
            const severityB = SEVERITY_MAP[b.severity] ?? 0;

            return severityA - severityB;
        });

        return defaultIssuesList;
    }, [aggregations]);

    useEffect(() => {
        const filteredList = transformedList.filter(
            (item) => item.severity === activeType
        );
        setIssueList(filteredList);
    }, [transformedList, activeType]);

    const onChangeIssueList = useCallback(
        (actionName: string) => {
            setActiveType(actionName);
        },
        []
    );

    return {
        issueList,
        onChangeIssueList,
        activeType,
    };
};

export default useTypes;
