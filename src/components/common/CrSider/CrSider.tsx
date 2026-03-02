import React from 'react';
import type { ContentData } from '@features/Content/types/data.types.ts';
import { ContentRecordSider } from './components/ContentRecordSider';
import './styles.css';

interface CrSiderProps {
  className?: string;
  id?: string;
  onClick?: (event: React.MouseEvent) => void;
  record: ContentData; // Made required since it's always provided
  onClose?: () => void;
  isOpen?: boolean;
}

export const CrSider: React.FC<CrSiderProps> = ({
  className,
  id,
  onClick,
  record,
  onClose,
  isOpen = true,
}) => {
  return (
    <ContentRecordSider
      record={record}
      className={className}
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      onClick={onClick}
    />
  );
};
