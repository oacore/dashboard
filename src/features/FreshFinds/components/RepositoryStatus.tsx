import type { KeyboardEvent, MouseEvent } from 'react';

import inRepoIcon from '@/assets/icons/inRepo.svg';
import addInRepoIcon from '@/assets/icons/addInRepo.svg';
import addManuallyInRepoIcon from '@/assets/icons/addManuallyInRepo.svg';
import addAutoRepoIcon from '@/assets/icons/addedAutomaticallyViaFreshFinds.svg';

import type { FreshFindsRecord } from '../types/data.types';
import { useFreshFindsSettings } from '../hooks/useFreshFindsSettings';

const renderStatusLabel = (label: string, iconSrc?: string) => (
  <div className="status-wrapper">
    {iconSrc ? (
      <img src={iconSrc} alt="" aria-hidden className="fresh-finds__status-icon" />
    ) : null}
    {label}
  </div>
);

type RepositoryStatusProps = {
  value: unknown;
  record: FreshFindsRecord;
  onAddToRepository: (workId: number) => void;
  depositingWorkId: number | null;
};

export const RepositoryStatus = ({
  value,
  record,
  onAddToRepository,
  depositingWorkId,
}: RepositoryStatusProps) => {
  const { formValues } = useFreshFindsSettings();
  const integrationMode = formValues?.integrationMode;
  const status = value != null ? String(value).trim() : '';

  if (status === 'in_repository') {
    return renderStatusLabel('In my repository', inRepoIcon);
  }

  if (status === 'added') {
    const origin = record.deposit?.origin?.trim().toLowerCase() ?? '';

    if (origin === 'manual') {
      return renderStatusLabel('Added manually via FreshFinds', addManuallyInRepoIcon);
    }

    if (origin === 'automatic') {
      return renderStatusLabel('Added automatically via FreshFinds', addAutoRepoIcon);
    }

    return '-';
  }

  if (status === 'candidate') {
    if (integrationMode === 'pull') {
      return renderStatusLabel('Add to my repository', addInRepoIcon);
    }

    const isDepositing = depositingWorkId === record.workId;

    const handleAddToRepository = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onAddToRepository(record.workId);
    };

    const handleAddToRepositoryKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.stopPropagation();
      }
    };

    return (
      <button
        type="button"
        className="status-wrapper fresh-finds__add-to-repository"
        aria-label="Add to my repository"
        aria-busy={isDepositing}
        disabled={isDepositing}
        onClick={handleAddToRepository}
        onKeyDown={handleAddToRepositoryKeyDown}
      >
        <img src={addInRepoIcon} alt="" aria-hidden className="fresh-finds__status-icon" />
        Add to my repository
      </button>
    );
  }

  return '-';
};
