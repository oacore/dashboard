const getOrdinalSuffix = (value: number): string => {
  const remainder = value % 100;

  if (remainder >= 11 && remainder <= 13) {
    return 'th';
  }

  switch (value % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatFairSubmissionLabel = (submissionNumber: number): string =>
  `${submissionNumber}${getOrdinalSuffix(submissionNumber)} submission`;
