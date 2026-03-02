import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {ValidatorFeature} from '@features/Validator/ValidatorPage.tsx';

export function ValidatorPage() {
    useDocumentTitle('Validator');

    return (
        <ValidatorFeature/>
    );
}

