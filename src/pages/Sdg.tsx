import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {SdgFeature} from '@features/Sdg/Sdg.tsx';

export function SdgPage() {
    useDocumentTitle('SDG Insights');

    return (
        <SdgFeature/>
    );
}
