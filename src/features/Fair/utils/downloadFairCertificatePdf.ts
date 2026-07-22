import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

import { buildFairCertificatePngFilename } from '@features/Fair/utils/downloadFairCertificatePng';

export const buildFairCertificatePdfFilename = (repositoryName?: string | null): string =>
  buildFairCertificatePngFilename(repositoryName).replace(/\.png$/, '.pdf');

export const downloadFairCertificatePdf = async (
  element: HTMLElement,
  filename: string,
): Promise<void> => {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
  });

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(filename);
};
