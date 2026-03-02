import React, { useMemo } from 'react';
import { CrPaper } from '@core/core-ui';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import { InnerTableHeader } from './InnerTableHeader.tsx';
import { InnerTable, type InnerTableItem } from './InnerTable.tsx';
import { CompareCard } from './CompareCard.tsx';
import { useWorkData } from '@features/Duplicates/hooks/useWorkData.ts';
import { useMultipleOutputs } from '@features/Duplicates/hooks/useMultipleOutputs.ts';
import { useDeduplicationInfo } from '@features/Duplicates/hooks/useDeduplicationInfo.ts';
import '../styles.css';

interface ComparisonViewProps {
    duplicateData: DuplicateData;
    onBack: () => void;
    handleButtonToggle?: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
    duplicateData,
    onBack,
    handleButtonToggle,
}) => {
    const { updateWork, duplicateListDetails } = useDeduplicationInfo(duplicateData?.workId);

    const { isLoading: isLoadingWorkData } = useWorkData(duplicateData?.workId);

    const { combinedArray, documentIds, outputIdToApiType } = useMemo(() => {
        const duplicates = duplicateData?.duplicates || [];
        const documentIdsList: string[] = [];
        const apiTypeMap: Record<string, string> = {};

        const array: InnerTableItem[] =
            Array.isArray(duplicateListDetails) && duplicates.length > 0
                ? duplicates.map((obj, index) => {
                    const documentId = obj.documentId as string | undefined;
                    if (documentId) {
                        documentIdsList.push(documentId);
                        const apiType = duplicateListDetails[index]?.type;
                        if (apiType) {
                            apiTypeMap[String(documentId)] = apiType;
                        }
                    }
                    return {
                        ...obj,
                        ...duplicateListDetails[index],
                    };
                })
                : duplicates.map((obj) => {
                    const documentId = obj.documentId as string | undefined;
                    if (documentId) documentIdsList.push(documentId);
                    return { ...obj };
                });

        return { combinedArray: array, documentIds: documentIdsList, outputIdToApiType: apiTypeMap };
    }, [duplicateData, duplicateListDetails]);

    const { isLoading: isLoadingOutputs } = useMultipleOutputs(documentIds);

    const handleRedirect = (e: React.MouseEvent, id?: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!id) return;
        window.open(`https://core.ac.uk/outputs/${id}`, '_blank');
    };

    const isLoading = isLoadingWorkData || isLoadingOutputs;

    return (
        <CrPaper>
            <InnerTableHeader
                onClick={onBack}
                rowData={duplicateData}
            />
            <InnerTable
                combinedArray={combinedArray}
                handleButtonToggle={handleButtonToggle}
                handleRedirect={handleRedirect}
                loading={isLoading}
            />
            <CompareCard
                workId={duplicateData?.workId}
                documentIds={documentIds}
                duplicateData={duplicateData}
                updateWork={updateWork}
                outputIdToApiType={outputIdToApiType}
            />
        </CrPaper>
    );
};
