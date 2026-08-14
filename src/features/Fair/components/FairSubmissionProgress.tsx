import { CheckOutlined } from '@ant-design/icons';
import { FairCertificateView } from '@features/Fair/components/FairCertificateView.tsx';
import {
  useFairCertification,
  useFairCertificationSubmissions,
} from '@features/Fair/hooks/useFairCertification';
import { useFairCertificatePdfDownload } from '@features/Fair/hooks/useFairCertificatePdfDownload';
import fairTexts from '@features/Fair/texts/fair.json';
import type { FairCertificationSubmission } from '@features/Fair/types/fairCertification.types';
import { formatFairSubmissionLabel } from '@features/Fair/utils/formatFairSubmissionLabel';
import { Steps } from 'antd';
import type { StepsProps } from 'antd';
import { useMemo } from 'react';
import '../styles.css';

type CheckIconProps = {
  isCompleted?: boolean;
};

const CheckIcon = ({ isCompleted = true }: CheckIconProps) => (
  <span
    className={`fair-submission-progress__icon-check${isCompleted ? '' : ' fair-submission-progress__icon-check--pending'
      }`}
  >
    <CheckOutlined aria-hidden className="fair-submission-progress__check-icon" />
  </span>
);

const EllipsisIcon = () => (
  <span aria-hidden className="fair-submission-progress__icon-ellipsis">
    <span className="fair-submission-progress__ellipsis-dot" />
    <span className="fair-submission-progress__ellipsis-dot" />
    <span className="fair-submission-progress__ellipsis-dot" />
  </span>
);

type SubmissionProgressCopy = typeof fairTexts.submissionProgress;

const buildSubmissionStepItems = (
  submissions: FairCertificationSubmission[],
  hasCertificate: boolean,
  copy: SubmissionProgressCopy,
  onViewCertificatePdf?: () => void,
  isDownloadingCertificatePdf = false,
): NonNullable<StepsProps['items']> => {
  const sortedSubmissions = [...submissions].sort(
    (left, right) => left.submissionNumber - right.submissionNumber,
  );

  const completedSubmissionItems: NonNullable<StepsProps['items']> = sortedSubmissions.map(
    (submission) => ({
      status: 'finish' as const,
      icon: <CheckIcon />,
      title: (
        <div className="fair-submission-progress__step-heading">
          <span className="fair-submission-progress__step-date">
                {/*TODO replace with this one*/}
                {/*{formatDate(submission.pdfGeneratedAt)}*/}
            {submission.submissionDate}
          </span>
          <span className="fair-submission-progress__step-title">
            {formatFairSubmissionLabel(submission.submissionNumber)}
          </span>
        </div>
      ),
      content: submission.reportUrl ? (
        <a
          target="_blank"
          className="fair-submission-progress__report-link"
          href={`https://api.core.ac.uk${submission.reportUrl}`}
          rel="noopener noreferrer"
        >
          {copy.viewSubmittedReport}
        </a>
      ) : undefined,
    }),
  );

  const nextSubmissionNumber = sortedSubmissions.length + 1;

  const pendingSubmissionItem: NonNullable<StepsProps['items']>[number] = {
    status: 'wait' as const,
    icon: <CheckIcon isCompleted={false} />,
    title: (
      <span className="fair-submission-progress__step-title">
        {formatFairSubmissionLabel(nextSubmissionNumber)}
      </span>
    ),
  };

  const unlimitedSubmissionsItem: NonNullable<StepsProps['items']>[number] = {
    status: 'wait' as const,
    icon: <EllipsisIcon />,
    title: (
      <span className="fair-submission-progress__step-title fair-submission-progress__step-title--muted">
        {copy.unlimitedSubmissions}
      </span>
    ),
  };

  const gettingCertificateItem: NonNullable<StepsProps['items']>[number] = {
    status: hasCertificate ? ('finish' as const) : ('wait' as const),
    icon: <CheckIcon isCompleted={hasCertificate} />,
    title: (
      <span className="fair-submission-progress__step-title">
        {copy.gettingCertificate}
      </span>
    ),
    content: hasCertificate && onViewCertificatePdf ? (
      <button
        type="button"
        className="fair-submission-progress__report-link"
        aria-label={copy.viewCertificatePdf}
        disabled={isDownloadingCertificatePdf}
        onClick={onViewCertificatePdf}
      >
        {copy.viewCertificatePdf}
      </button>
    ) : undefined,
  };

  return [
    ...completedSubmissionItems,
    pendingSubmissionItem,
    unlimitedSubmissionsItem,
    gettingCertificateItem,
  ];
};

export const FairSubmissionProgress = () => {
  const { submissionProgress } = fairTexts;
  const { submissions } = useFairCertificationSubmissions();
  const { fairCertification } = useFairCertification();
  const certificate = fairCertification?.certificate;
  const hasCertificate = Boolean(certificate);
  const { certificateRef, handleDownloadPdf, isDownloadingPdf } =
    useFairCertificatePdfDownload(certificate);

  const items = useMemo(
    () =>
      buildSubmissionStepItems(
        submissions,
        hasCertificate,
        submissionProgress,
        handleDownloadPdf,
        isDownloadingPdf,
      ),
    [submissions, hasCertificate, submissionProgress, handleDownloadPdf, isDownloadingPdf],
  );

  return (
    <section className="fair-submission-progress">
      <h2 className="fair-submission-progress__title">
        {submissionProgress.title}
      </h2>
      <Steps
        className="fair-submission-progress-steps"
        items={items}
        orientation="vertical"
        responsive={false}
      />
      {certificate && (
        <div
          aria-hidden
          className="fair-submission-progress__certificate-export"
        >
          <FairCertificateView ref={certificateRef} certificationData={certificate} />
        </div>
      )}
    </section>
  );
};
