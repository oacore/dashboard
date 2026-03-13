import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {SwFeature} from '@features/ResearchSoftware/ResearchSoftware.tsx'
export function ResearchSoftwarePage() {
    useDocumentTitle('Research Software');

    return (
        <SwFeature/>
    );
}

