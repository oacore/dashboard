const stripDoiOrgPrefix = (doi: string): string =>
  doi.trim().replace(/^\s*https?:\/\/doi\.org\//i, '');

/** Canonical https DOI URL, or empty if there is nothing to link. */
export const buildFreshFindsDoiHref = (doi: string): string => {
  const slug = stripDoiOrgPrefix(doi);
  if (slug === '') {
    return '';
  }
  return `https://doi.org/${encodeURIComponent(slug)}`;
};

/** Drawer outputs target: DOI resolver, or CORE home when DOI is missing. */
export const buildFreshFindsOutputsUrl = (doi: string | undefined): string => {
  const trimmed = doi?.trim() ?? '';
  if (trimmed === '') {
    return 'https://core.ac.uk/';
  }
  const href = buildFreshFindsDoiHref(trimmed);
  return href !== '' ? href : 'https://core.ac.uk/';
};
