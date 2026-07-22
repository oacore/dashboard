import { CheckOutlined } from '@ant-design/icons';
import { useFairCertificationSubmissions } from '@features/Fair/hooks/useFairCertification';
import fairTexts from '@features/Fair/texts/fair.json';
import type { FairCertificationSubmission } from '@features/Fair/types/fairCertification.types';
import { formatFairSubmissionLabel } from '@features/Fair/utils/formatFairSubmissionLabel';
import { formatDate } from '@/utils/dateUtils';
import { Steps } from 'antd';
import type { StepsProps } from 'antd';
import { useMemo } from 'react';
import '../styles.css';

const CheckIcon = () => (
  <span className="fair-submission-progress__icon-check">
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
  copy: SubmissionProgressCopy,
): NonNullable<StepsProps['items']> => {
  const sortedSubmissions = [...submissions].sort(
    (left, right) => left.submissionNumber - right.submissionNumber,
  );

  const submissionItems: NonNullable<StepsProps['items']> = sortedSubmissions.map(
    (submission) => ({
      status: 'finish' as const,
      icon: <CheckIcon />,
      title: (
        <div className="fair-submission-progress__step-heading">
          <span className="fair-submission-progress__step-date">
            {formatDate(submission.pdfGeneratedAt)}
          </span>
          <span className="fair-submission-progress__step-title">
            {formatFairSubmissionLabel(submission.submissionNumber)}
          </span>
        </div>
      ),
      description: submission.reportUrl ? (
        <a
          className="fair-submission-progress__report-link"
          href={`https://api.core.ac.uk${submission.reportUrl}`}
          rel="noopener noreferrer"
        >
          {copy.viewSubmittedReport}
        </a>
      ) : undefined,
    }),
  );

  return [
    ...submissionItems,
    {
      status: 'finish' as const,
      icon: <EllipsisIcon />,
      title: (
        <span className="fair-submission-progress__step-title fair-submission-progress__step-title--muted">
          {copy.unlimitedSubmissions}
        </span>
      ),
    },
    {
      status: 'finish' as const,
      icon: <CheckIcon />,
      title: (
        <span className="fair-submission-progress__step-title">
          {copy.gettingCertificate}
        </span>
      ),
    },
  ];
};

export const FairSubmissionProgress = () => {
  const { submissionProgress } = fairTexts;
  const { submissions } = useFairCertificationSubmissions();

  const items = useMemo(
    () => buildSubmissionStepItems(submissions, submissionProgress),
    [submissions, submissionProgress],
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
    </section>
  );
};
