import {CrFeatureLayout, CrPaper, Markdown} from '@oacore/core-ui';
import placeholder from '@/assets/img/certificatePlaceholder.svg';

import '../styles.css';
import {Button} from 'antd';

import fairTexts from '../texts/fair.json';

// TODO: replace with API data (status, dates, submission count, actions).
export const ApprovedFairView = () => {
  const { approvedView } = fairTexts;

  return (
    <CrFeatureLayout>
      <CrPaper>
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
              {approvedView.lastReportUpdateLine}
            </Markdown>
            <Markdown className="fair-certification-meta-line">
              {approvedView.submissionsLine}
            </Markdown>
          </div>
          <div>
            <img src={placeholder} alt=""/>
          </div>
        </div>
      </CrPaper>
    </CrFeatureLayout>
  );
};
