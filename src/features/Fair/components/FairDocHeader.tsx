import fairTexts from '@features/Fair/texts/fair.json';
import { Markdown } from '@oacore/core-ui';
import { Button } from 'antd';
import placeholder from '@/assets/img/certificatePlaceholder.svg';
import { FairCertificateView } from '@features/Fair/components/FairCertificateView.tsx';
import type { FairCertificationApiResponse } from '@features/Fair/types/fairCertification.types';
import { formatIsoDate } from '@/utils/dateUtils';
import '../styles.css';

export type FairDocHeaderProps = {
  certificationQuestions?: FairCertificationApiResponse | null;
};

export const FairDocHeader = ({ certificationQuestions }: FairDocHeaderProps) => {
  const { approvedView } = fairTexts;
  const certificate = certificationQuestions?.certificate;

  return (
    <>
      <div className="fair-button-wrapper">
        <Button
          type="default"
          href="https://core.ac.uk/services/fair-certification"
        >
          {approvedView.aboutButtonLabel}
        </Button>
        <Button
          type="primary"
          onClick={() => alert('Download report')}
        >
          {approvedView.downloadReportButtonLabel}
        </Button>
      </div>
      <div className="fair-certification-header-wrapper">
        <div className="fair-certification-header-inner-wrapper">
          <h1 className="fair-certification-title">{approvedView.title}</h1>
          <Markdown className="fair-certification-description">
            {approvedView.certificationDescription}
          </Markdown>
          <Markdown className="fair-certification-meta-line">
            {`${approvedView.issued} ${formatIsoDate(certificate?.issueDate)}`}
          </Markdown>
          <Markdown className="fair-certification-meta-line">
            {`${approvedView.valid} ${formatIsoDate(certificate?.validUntil)}`}
          </Markdown>
          <Markdown className="fair-certification-meta-line">
            {`${approvedView.lastReportUpdateLine} ${formatIsoDate(certificate?.reviewedAt)}`}
          </Markdown>
          <Markdown className="fair-certification-meta-line">
            {`${approvedView.submissionsLine}${certificationQuestions?.numberOfSubmissions ?? ''}`}
          </Markdown>
        </div>
        {certificationQuestions?.certificate ?
          <FairCertificateView certificationData={certificationQuestions?.certificate} />
          :
          <img  className="fair-certification-placeholder" src={placeholder} alt=""/>
        }
      </div>
    </>
  );
};
