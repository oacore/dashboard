import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {DepositComplianceFeature} from '@features/DepositCompliance/DepositCompliance.tsx';

export function DepositCompliancePage() {
    useDocumentTitle('OA Compliance');

    return (
       <DepositComplianceFeature/>
    );
}

