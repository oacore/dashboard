import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { DoiFeature } from '@/features/Doi/DoiFeature';

export function DoiPage() {
    useDocumentTitle('DOI');

    return <DoiFeature />;
}

