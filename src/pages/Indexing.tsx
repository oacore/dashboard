import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {IndexingFeature} from '@features/indexing/Indexing.tsx';

export function IndexingPage() {
  useDocumentTitle('Indexing Status');

  return (
    <IndexingFeature/>
  );
}
