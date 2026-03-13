import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {OverviewFeature} from '@features/Overview/Overview.tsx';

export function OverviewPage() {
  useDocumentTitle('Overview');

  return (
    <OverviewFeature />
  );
}
