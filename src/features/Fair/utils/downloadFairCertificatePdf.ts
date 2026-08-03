import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

import { buildFairCertificateBadgeFilename } from '@features/Fair/utils/downloadFairCertificateBadge';

const EXPORT_SCALE = 4;
const PDF_WIDTH_MM = 297;

export const buildFairCertificatePdfFilename = (repositoryName?: string | null): string =>
  buildFairCertificateBadgeFilename(repositoryName).replace(/\.svg$/, '.pdf');

export const downloadFairCertificatePdf = async (
  element: HTMLElement,
  filename: string,
): Promise<void> => {
  const canvas = await toCanvas(element, {
    cacheBust: true,
    pixelRatio: EXPORT_SCALE,
    backgroundColor: '#FAFAFA',
    style: { margin: '0', justifySelf: 'unset' },
  });

  const pageHeightMm = PDF_WIDTH_MM * (canvas.height / canvas.width);
  const pdf = new jsPDF({
    unit: 'mm',
    format: [PDF_WIDTH_MM, pageHeightMm],
    orientation: 'landscape',
  });

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, PDF_WIDTH_MM, pageHeightMm);
  pdf.save(filename);
};
