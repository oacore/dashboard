import type { ActionItem } from '@components/common/CrTable/types.ts';
import { CrTableActions } from '@components/common/CrTableActions/tableActions.ts';
import type { SwRow } from '@features/ResearchSoftware/types/sw.types';
import type { TableActionRecord } from '@components/common/CrTableActions/tableActions.ts';

export const actions: ActionItem<SwRow>[] = CrTableActions<TableActionRecord>() as ActionItem<SwRow>[];
