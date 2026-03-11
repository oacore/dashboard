import texts from '../texts';
import type { IssuesAggregation, IssueMessage } from '@features/indexing/types';
import { CrIssuesDisplay } from '@oacore/core-ui';
import { IssuesList } from './IssuesList';
import { useIssuesAggregation } from '../hooks/useIssuesAggregation';
import { useMemo } from 'react';
import '../styles.css';

interface TypesListProps {
  aggregation: IssuesAggregation | null;
  isLoading?: boolean;
  error?: boolean;
}

interface IssueItem {
  actualType: string;
  title: string;
  description?: string;
  resolution?: string;
  outputsAffectedCount: number;
  severity: string;
  hidden?: boolean;
}

export const TypesList = ({ aggregation, isLoading = false, error = false }: TypesListProps) => {

  const { getDownloadUrl } = useIssuesAggregation();

  // Get all issues without filtering by activeType
  const allIssues = useMemo<IssueItem[]>(() => {
    if (!aggregation?.countByType) {
      return [];
    }

    return Object.entries(aggregation.countByType)
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
  }, [aggregation]);

  const errorsList = useMemo(
    () => allIssues.filter((item) => item.severity === 'ERROR'),
    [allIssues]
  );

  const warningsList = useMemo(
    () => allIssues.filter((item) => item.severity === 'WARNING'),
    [allIssues]
  );

  return (
    <CrIssuesDisplay
      isLoading={isLoading}
      errorState={
        error
          ? {
            show: true,
            message: 'Failed to load issues data. Please try again later.',
          }
          : undefined
      }
      errorsSection={{
        items: errorsList,
        title: texts.actions.find((a) => a.action === 'ERROR')?.name || 'Errors',
        placeholder: 'No errors found',
        hasItems: errorsList.length > 0,
        renderItems: () => (
          <IssuesList
            getDownloadUrl={getDownloadUrl}
            typesList={errorsList}
          />
        ),
      }}
      warningsSection={{
        items: warningsList,
        title: texts.actions.find((a) => a.action === 'WARNING')?.name || 'Warnings',
        placeholder: 'No warnings found',
        hasItems: warningsList.length > 0,
        renderItems: () => (
          <IssuesList
            getDownloadUrl={getDownloadUrl}
            typesList={warningsList}
          />
        ),
      }}
    />
  );
};
