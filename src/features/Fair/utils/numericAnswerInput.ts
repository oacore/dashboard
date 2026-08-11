import type { KeyboardEvent } from 'react';

export const sanitizeNumericAnswer = (value: string): string => value.replace(/\D/g, '');

export const normalizeFairAnswer = (value: string, isNumeric: boolean): string =>
  isNumeric ? sanitizeNumericAnswer(value) : value;

const handleNumericKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  const { altKey, ctrlKey, key, metaKey } = event;

  if (!ctrlKey && !metaKey && !altKey && key.length === 1 && !/^\d$/.test(key)) {
    event.preventDefault();
  }
};

export const numericAnswerInputProps = {
  inputMode: 'numeric' as const,
  onKeyDown: handleNumericKeyDown,
};
