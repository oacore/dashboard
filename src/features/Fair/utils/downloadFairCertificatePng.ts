import { toPng } from 'html-to-image';

import { downloadFile } from '@/utils/downloadUtils';

const sanitizeFilenamePart = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const buildFairCertificatePngFilename = (repositoryName?: string | null): string => {
  const repositoryPart = repositoryName ? sanitizeFilenamePart(repositoryName) : 'repository';

  return `fair-certification-badge-${repositoryPart}.png`;
};

export const downloadFairCertificatePng = async (
  element: HTMLElement,
  filename: string,
): Promise<void> => {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
  });

  downloadFile(dataUrl, filename);
};
