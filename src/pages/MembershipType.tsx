import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {MembershipTypeFeature} from '@features/Membership/Membership.tsx';

export function MembershipTypePage() {
    useDocumentTitle('My membership');

    return (
       <MembershipTypeFeature/>
    );
}
