import { DasFeature } from '@/features/Das/Das';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export function DasPage() {
    useDocumentTitle('DAS Identification');

    return (
        <DasFeature />
    );
}
