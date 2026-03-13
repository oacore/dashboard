import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {DeduplicationFeature} from '@features/Duplicates/Duplicates.tsx';

export function DeduplicationPage() {
    useDocumentTitle('Versions/Duplicates');

    return (
        <DeduplicationFeature/>
    );
}

