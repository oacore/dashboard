import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {BadgesFeature} from "@features/Badges/BadgesFeature.tsx";

export function BadgesPage() {
  useDocumentTitle('CORE badges');

    return <BadgesFeature />;
}
