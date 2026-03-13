import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { UsrnViewPage } from '@features/Usrn/UsrnView.tsx';

export function UsrnPage() {
  useDocumentTitle('USRN');

    return <UsrnViewPage />;
}
