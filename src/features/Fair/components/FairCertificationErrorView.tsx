import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import '../styles.css';
// TODO make reusable
export const FairCertificationErrorView = () => {
  const { loadErrorMessage } = fairTexts.approvedView;

  return (
    <CrFeatureLayout>
      <CrPaper>
        <div
          className="fair-certification-error"
          role="alert"
          aria-live="polite"
        >
          <p className="fair-certification-error__message">{loadErrorMessage}</p>
        </div>
      </CrPaper>
    </CrFeatureLayout>
  );
};
