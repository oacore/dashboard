import { useCallback, useRef, useState } from 'react';
import { message } from 'antd';

import fairTexts from '@features/Fair/texts/fair.json';
import type { FairCertificationApiCertificate } from '@features/Fair/types/fairCertification.types';
import {
  buildFairCertificatePdfFilename,
  downloadFairCertificatePdf,
} from '@features/Fair/utils/downloadFairCertificatePdf';

export const useFairCertificatePdfDownload = (
  certificate?: FairCertificationApiCertificate | null,
) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const { downloadPdfErrorMessage } = fairTexts.approvedView;

  const handleDownloadPdf = useCallback(async () => {
    if (!certificateRef.current) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      const filename = buildFairCertificatePdfFilename(certificate?.repositoryName);
      await downloadFairCertificatePdf(certificateRef.current, filename);
    } catch {
      message.error(downloadPdfErrorMessage);
    } finally {
      setIsDownloadingPdf(false);
    }
  }, [certificate?.repositoryName, downloadPdfErrorMessage]);

  return {
    certificateRef,
    handleDownloadPdf,
    isDownloadingPdf,
  };
};
