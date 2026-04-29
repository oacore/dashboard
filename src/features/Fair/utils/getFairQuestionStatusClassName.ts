export const getFairQuestionStatusClassName = (statusLabel?: string): string => {
  if (!statusLabel) {
    return 'support-status__status--neutral';
  }
  const normalized = statusLabel.trim().toLowerCase();
  if (normalized === 'yes') {
    return 'support-status__status--yes';
  }
  if (normalized === 'no') {
    return 'support-status__status--no';
  }
  if (normalized.includes('error')) {
    return 'support-status__status--no';
  }
  return 'support-status__status--neutral';
};
