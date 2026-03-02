export const statusToCaption = (status?: 'full' | 'partial' | 'none'): string | null => {
  switch (status) {
    case 'full':
      return 'Matches Crossref';
    case 'partial':
      return 'Matches Crossref partially';
    case 'none':
      return 'Does not match Crossref';
    default:
      return null;
  }
};
