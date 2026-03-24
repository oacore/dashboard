import { CrPaper, Markdown } from '@oacore/core-ui';
import { toAbsoluteAssetUrl } from '@/utils/contentUtils';
import './styles.css';

export type FairCertificationHowItWorks = {
  title: string;
  description: string;
  image: string;
};

export type FairCertificationStep = {
  step: number | string;
  title: string;
  description: string;
};

export type FairCertificationApplicationProcess = {
  title: string;
  steps: FairCertificationStep[];
};

export type FairCertificationCertificate = {
  title: string;
  picture: string;
  description: string;
};

/** Content API nests each section under a key matching the section name. */
export type FairCertificationData = {
  howItWorks: { howItWorks: FairCertificationHowItWorks };
  applicationProcess: { applicationProcess: FairCertificationApplicationProcess };

  certificates: { certificates: FairCertificationCertificate[] };
};

export type FairFeatureProps = {
  data: FairCertificationData;
};

export const FairFeature = ({ data }: FairFeatureProps) => {
  const howItWorks = data.howItWorks.howItWorks;
  const applicationProcess = data.applicationProcess.applicationProcess;
  const certificates = data.certificates.certificates;

  const howItWorksImageUrl = toAbsoluteAssetUrl(howItWorks.image);

  return (
    <CrPaper>
      <div className="fair-certification">
        <section className="certification-how-it-works" aria-labelledby="fair-how-title">
          <div>
            <h2 id="fair-how-title" className="fair-certification-ection-title">
              {howItWorks.title}
            </h2>
            <Markdown className="fair-certification-markdown">{howItWorks.description}</Markdown>
          </div>
          <img
            src={howItWorksImageUrl}
            alt=""
            className="fair-certification-how-image"
            width={400}
            height={280}
          />
        </section>
        <section aria-labelledby="fair-application-title">
          <h2 id="fair-application-title" className="fair-certification__section-title">
            {applicationProcess.title}
          </h2>
          <div className="fair-certification-steps">
            {applicationProcess.steps.map((step, index) => (
              <div key={`step-${index}`} className="fair-certification-step">
                <span className="fair-certification-step-num" aria-hidden>
                  {step.step ?? index + 1}
                </span>
                <div>
                  <h3 className="fair-certification-feature-title">{step.title}</h3>
                  <Markdown className="fair-certification-markdown">{step.description}</Markdown>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="type" aria-labelledby="fair-cert-title">
          <h2 id="fair-cert-title" className="certification-section-title">
            CORE FAIR Repository Certificates
          </h2>
          <div className="certificate-item-wrapper">
            {certificates.map((cert, index) => (
              <article key={`cert-${index}`} className="certificate-item">
                <img src={toAbsoluteAssetUrl(cert.picture)} alt="" width={80} height={80} />
                <h3 className="certification-title">{cert.title}</h3>
                <Markdown className="certification-markdown">{cert.description}</Markdown>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CrPaper>
  );
};
