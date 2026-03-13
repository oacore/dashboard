import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { RepositoryFeature} from '@features/Settings/RepositorySettings/RepositorySettings.tsx';

export function RepositorySettingsPage() {
  useDocumentTitle('Repository');

  return (
    <RepositoryFeature/>
  );
}
