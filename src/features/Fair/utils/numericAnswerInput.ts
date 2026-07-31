import type { ChangeEvent, KeyboardEvent } from 'react';

export const sanitizeNumericAnswer = (value: string): string => value.replace(/\D/g, '');

export const numericAnswerInputProps = {
  inputMode: 'numeric' as const,
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const { altKey, ctrlKey, key, metaKey } = event;

    if (!ctrlKey && !metaKey && !altKey && key.length === 1 && !/^\d$/.test(key)) {
      event.preventDefault();
    }
  },
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = sanitizeNumericAnswer(event.target.value);

    if (event.target.value !== sanitized) {
      event.target.value = sanitized;
    }
  },
};
