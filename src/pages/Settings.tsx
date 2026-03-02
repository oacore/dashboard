import { useDocumentTitle } from '@hooks/useDocumentTitle';

export function SettingsPage() {
  useDocumentTitle('Settings');

  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page content.</p>
    </div>
  );
}

