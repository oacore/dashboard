import type { ActionItem } from '@components/common/CrTable/types.ts';
import type { OrcidData } from '@features/Orcid/types/data.types.ts';
import { CrTableActions} from '@components/common/CrTableActions/tableActions.ts';

export const actions: ActionItem<OrcidData>[] = CrTableActions<OrcidData>();
