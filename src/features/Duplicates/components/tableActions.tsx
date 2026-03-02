import type { ActionItem } from '@components/common/CrTable/types.ts';
import { CrTableActions } from '@components/common/CrTableActions/tableActions.ts';
import type { InnerTableItem } from './InnerTable.tsx';

export const actions: ActionItem<InnerTableItem>[] = CrTableActions<InnerTableItem>();
