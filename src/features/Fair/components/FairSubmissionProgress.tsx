import { CheckOutlined } from '@ant-design/icons';
import fairTexts from '@features/Fair/texts/fair.json';
import { Steps } from 'antd';
import type { StepsProps } from 'antd';
import classNames from 'classnames';
import '../styles.css';

export type FairSubmissionProgressStep = {
  label: string;
  /** Middle “unlimited submissions” row: dots icon + muted title. */
  ellipsis?: boolean;
};

export type FairSubmissionProgressProps = {
  steps?: FairSubmissionProgressStep[];
};

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

// TODO: replace with API-driven steps when available.
const defaultSteps = (
  copy: typeof fairTexts.submissionProgress,
): FairSubmissionProgressStep[] => [
  { label: copy.firstSubmission },
  { label: copy.secondSubmission },
  { label: copy.unlimitedSubmissions, ellipsis: true },
  { label: copy.gettingCertificate },
];

const toAntItems = (
  steps: FairSubmissionProgressStep[],
): NonNullable<StepsProps['items']> =>
  steps.map(({ label, ellipsis }) => ({
    status: 'finish' as const,
    icon: ellipsis ? <EllipsisIcon /> : <CheckIcon />,
    title: (
      <span
        className={classNames('fair-submission-progress__step-title', {
          'fair-submission-progress__step-title--muted': ellipsis,
        })}
      >
        {label}
      </span>
    ),
  }));

export const FairSubmissionProgress = ({
  steps: stepsFromProps,
}: FairSubmissionProgressProps) => {
  const { submissionProgress } = fairTexts;
  const items = toAntItems(stepsFromProps ?? defaultSteps(submissionProgress));

  return (
    <section
      className="fair-submission-progress"
    >
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
