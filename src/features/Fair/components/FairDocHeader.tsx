import { useCallback, useRef, useState } from 'react';

import fairTexts from '@features/Fair/texts/fair.json';
import { Markdown } from '@oacore/core-ui';
import { Button, message } from 'antd';
import placeholder from '@/assets/img/certificatePlaceholder.svg';
import { FairCertificateView } from '@features/Fair/components/FairCertificateView.tsx';
import type { FairCertificationApiResponse } from '@features/Fair/types/fairCertification.types';
import {
  buildFairCertificatePngFilename,
  downloadFairCertificatePng,
} from '@features/Fair/utils/downloadFairCertificatePng';
import {
  buildFairCertificatePdfFilename,
  downloadFairCertificatePdf,
} from '@features/Fair/utils/downloadFairCertificatePdf';
import { formatIsoDate } from '@/utils/dateUtils';
import '../styles.css';
import {useDataProviderStore} from '@/store/dataProviderStore.ts';

export type FairDocHeaderProps = {
  certificationQuestions?: FairCertificationApiResponse | null;
};

export const FairDocHeader = ({ certificationQuestions }: FairDocHeaderProps) => {
  const { approvedView } = fairTexts;
  const { selectedDataProvider } = useDataProviderStore();
  const certificate = certificationQuestions?.certificate;
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPng = useCallback(async () => {
    if (!certificateRef.current) {
      return;
    }

    setIsDownloadingPng(true);

    try {
      const filename = buildFairCertificatePngFilename(certificate?.repositoryName);
      await downloadFairCertificatePng(certificateRef.current, filename);
    } catch {
      message.error(approvedView.downloadPngErrorMessage);
    } finally {
      setIsDownloadingPng(false);
    }
  }, [approvedView.downloadPngErrorMessage, certificate?.repositoryName]);

  const handleDownloadPdf = useCallback(async () => {
    if (!certificateRef.current) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      const filename = buildFairCertificatePdfFilename(certificate?.repositoryName);
      await downloadFairCertificatePdf(certificateRef.current, filename);
    } catch {
      message.error(approvedView.downloadPdfErrorMessage);
    } finally {
      setIsDownloadingPdf(false);
    }
  }, [approvedView.downloadPdfErrorMessage, certificate?.repositoryName]);

  return (
    <>
      <div className="fair-button-wrapper">
        <Button
          type="default"
          target="_blank"
          href="https://core.ac.uk/services/fair-certification"
        >
          {approvedView.aboutButtonLabel}
        </Button>
        {/*TODO*/}
        {/*fair-certification/FAIR-2026-4A717572CF12/report*/}
        <Button
          target="_blank"
          type={certificationQuestions?.certificate ? 'default' : 'primary'}
          href={`https://api.core.ac.uk/internal/data-providers/${selectedDataProvider?.id}${certificate?.reportUrl}`}
        >
          {approvedView.downloadReportButtonLabel}
        </Button>
        {certificationQuestions?.certificate &&
          <>
            <Button
              type="default"
              aria-label={approvedView.downloadPNG}
              loading={isDownloadingPng}
              onClick={handleDownloadPng}
            >
              {approvedView.downloadPNG}
            </Button>
            <Button
              type="primary"
              aria-label={approvedView.downloadPdf}
              loading={isDownloadingPdf}
              onClick={handleDownloadPdf}
            >
              {approvedView.downloadPdf}
            </Button>
          </>
        }
      </div>
      <div className="fair-certification-header-wrapper">
        <div className="fair-certification-header-inner-wrapper">
          <h1 className="fair-certification-title">{approvedView.title}</h1>
          <Markdown className="fair-certification-description">
            {approvedView.certificationDescription}
          </Markdown>
          {certificate?.issueDate && (
            <Markdown className="fair-certification-meta-line">
              {`${approvedView.issued} ${formatIsoDate(certificate?.issueDate)}`}
            </Markdown>
          ) }
          {certificate?.validUntil && (
            <Markdown className="fair-certification-meta-line">
              {`${approvedView.valid} ${formatIsoDate(certificate?.validUntil)}`}
            </Markdown>
          )}
          {certificate?.reviewedAt && (
            <Markdown className="fair-certification-meta-line">
              {`${approvedView.lastReportUpdateLine} ${formatIsoDate(certificate?.reviewedAt)}`}
            </Markdown>
          )}
          <Markdown className="fair-certification-meta-line">
            {`${approvedView.submissionsLine}${certificationQuestions?.numberOfSubmissions ?? ''}`}
          </Markdown>
        </div>
        {certificationQuestions?.certificate ?
          <FairCertificateView
            ref={certificateRef}
            certificationData={certificationQuestions?.certificate}
          />
          :
          <img
            className="fair-certification-placeholder"
            src={placeholder}
            alt=""
          />
        }
      </div>
    </>
  );
};
