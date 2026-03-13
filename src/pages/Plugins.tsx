import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { PluginsFeature } from '@features/Plugins';

export function PluginsPage() {
  useDocumentTitle('Plugins');

  return (
    <PluginsFeature />
  );
}

