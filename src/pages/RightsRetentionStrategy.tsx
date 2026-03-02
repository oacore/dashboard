import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {RrsFeature} from '@features/Rrs-policy/Rrs.tsx';

export function RightsRetentionStrategyPage() {
    useDocumentTitle('RRS Policy');

    return <RrsFeature/>
}
