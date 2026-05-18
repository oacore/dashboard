import {useDocumentTitle} from '@hooks/useDocumentTitle.ts';
import {FreshFindsFeature} from '@features/FreshFinds/FreshFindsFeature.tsx';

export function FreshFindsPage() {
  useDocumentTitle('Fresh finds');
  return <FreshFindsFeature />;
}
