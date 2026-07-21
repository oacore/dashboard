import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles.css';

export const FairCertificationLoadingView = () => (
  <CrFeatureLayout>
    <CrPaper>
      <div
        className="fair-certification-loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading FAIR certification"
      >
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <p className="fair-certification-loading-text">Loading...</p>
      </div>
    </CrPaper>
  </CrFeatureLayout>
);
