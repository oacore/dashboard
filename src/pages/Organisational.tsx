import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {
  OrganisationalFeature,
} from '@features/Settings/OrganisationalSettings/OrganisationalSettings.tsx';

export function OrganisationalPage() {
  useDocumentTitle('Organisational');

  return (
    <OrganisationalFeature/>
  );
}
