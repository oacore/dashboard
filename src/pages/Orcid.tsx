import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {OrcideFeature} from '@features/Orcid/Orcide.tsx';

export function OrcidPage() {
    useDocumentTitle('ORCID');

    return <OrcideFeature />;
}
