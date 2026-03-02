import type { ActionItem } from '@components/common/CrTable/types.ts';
import type { DasData } from '@features/Das/types/data.types.ts';
import { CrTableActions} from '@components/common/CrTableActions/tableActions.ts';

export const actions: ActionItem<DasData>[] = CrTableActions<DasData>();
