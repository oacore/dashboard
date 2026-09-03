import type { ActionItem } from '@components/common/CrTable/types.ts';

import type { FreshFindsRecord } from '../types/data.types';

export const actions: ActionItem<FreshFindsRecord>[] = [
  {
    key: 'not-relevant',
    label: 'Not relevant',
    onClick: (record) => {
      console.log('Not relevant', record.workId);
    },
  },
  {
    key: 'not-from-institution',
    label: 'Not from my institution',
    onClick: (record) => {
      console.log('Not from my institution', record.workId);
    },
  },
  {
    key: 'remove-from-suggestions',
    label: 'Remove from suggestions',
    onClick: (record) => {
      console.log('Remove from suggestions', record.workId);
    },
  },
];
