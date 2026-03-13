import type { ActionItem } from '@components/common/CrTable/types.ts';
import type { RrsData } from '@features/Rrs-policy/types/data.types.ts';
import { CrTableActions} from '@components/common/CrTableActions/tableActions.ts';

export const actions: ActionItem<RrsData>[] = CrTableActions<RrsData>();
