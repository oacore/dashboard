import {CrFeatureLayout, CrPaper} from '@oacore/core-ui';
import '../styles.css';

import {FairDocHeader} from '@features/Fair/components/FairDocHeader.tsx';
import {FairPrinciplesCollapse} from '@features/Fair/components/FairPrinciplesCollapse.tsx';

// TODO: replace with API data (status, dates, submission count, actions).
export const ApprovedFairView = () => {

  return (
    <CrFeatureLayout>
      <CrPaper>
        <FairDocHeader/>
        <FairPrinciplesCollapse/>
      </CrPaper>
    </CrFeatureLayout>
  );
};
