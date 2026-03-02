import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {ContentFeature} from '@features/Content/Content.tsx';

export function ContentPage() {
    useDocumentTitle('Content');

    return (
       <ContentFeature/>
    );
}

